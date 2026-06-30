import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { useWaterCanvas } from '../hooks/useWaterCanvas.js'
import { useCurvedPanel } from '../hooks/useCurvedPanel.js'
import { useIsTouch } from '../hooks/useMediaQuery.js'

gsap.registerPlugin(ScrollTrigger)

const REASONS = [
  {
    num: '01',
    kicker: 'For your hotel',
    title: 'Zero operational lift',
    body: 'We handle everything from setup to teardown. Your staff does nothing extra — we run the entire experience so you can focus on what you do best.',
    img: '/assets/card-hotels.jpg',
  },
  {
    num: '02',
    kicker: 'For your guests',
    title: 'A genuine wellness signature',
    body: 'Guests remember a stay because of how it made them feel. Our poolside service becomes the moment of the holiday your guests tell everyone about.',
    img: '/assets/hero-massage.png',
  },
  {
    num: '03',
    kicker: 'The details',
    title: 'Premium presentation, naturally',
    body: 'From bespoke towel rolls to island-scented oils — every detail is considered. The setup is elegant, the service is impeccable.',
    img: '/assets/card-natural.jpg',
  },
  {
    num: '04',
    kicker: 'Built around you',
    title: 'Flexible to your property',
    body: 'Morning sessions, afternoon runs, weekend-only rotations — we adapt to your hotel\'s rhythm, not the other way around.',
    img: '/assets/card-island.jpg',
  },
  {
    num: '05',
    kicker: 'The results',
    title: 'Measurable guest satisfaction',
    body: 'Hotels that have added Aloha to their poolside see a consistent uplift in wellness-related review scores and repeat visits.',
    img: '/assets/card-hotels.jpg',
  },
]

const PERFECT_FOR = [
  { label: 'Boutique hotels & resorts' },
  { label: 'Luxury villas with pool' },
  { label: 'Wellness retreats' },
  { label: 'Beach clubs' },
  { label: 'Corporate retreats' },
]

const GALLERY_IMAGES = [
  '/assets/hero-massage.png',
  '/assets/card-island.jpg',
  '/assets/card-natural.jpg',
  '/assets/card-hotels.jpg',
  '/assets/hero-massage.png',
  '/assets/card-natural.jpg',
]

export default function Hotels() {
  const heroRef   = useRef(null)
  const canvasRef = useRef(null)
  const galleryRef = useRef(null)
  const panelRef  = useRef(null)

  useWaterCanvas(heroRef, canvasRef)
  useCurvedPanel(panelRef)
  const isTouch = useIsTouch()

  // ── Infinite gallery ──────────────────────────────────────────────────
  useEffect(() => {
    const track = galleryRef.current
    if (!track) return

    let x = 0
    let velocity = 0
    let scrollVel = 0
    let lastScrollY = window.scrollY
    let drag = false
    let dragStartX = 0
    let dragStartPos = 0
    let lastDragX = 0
    let lastDragTime = 0
    let itemWidth = 0
    let totalWidth = 0
    let raf = null

    function measure() {
      const item = track.firstElementChild
      if (!item) return
      itemWidth = item.offsetWidth + 24
      totalWidth = itemWidth * GALLERY_IMAGES.length
    }

    function loop() {
      const now = Date.now()
      x -= 0.35 + scrollVel * 0.08
      if (!drag) velocity *= 0.94
      if (!drag) x += velocity
      scrollVel *= 0.88

      if (totalWidth > 0 && x < -totalWidth) x += totalWidth
      if (totalWidth > 0 && x > 0) x -= totalWidth

      track.style.transform = `translateX(${x}px)`
      raf = requestAnimationFrame(loop)
    }

    function onScroll() {
      const dy = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
      scrollVel = dy
    }

    function onMouseDown(e) {
      drag = true
      dragStartX = e.clientX
      dragStartPos = x
      lastDragX = e.clientX
      lastDragTime = Date.now()
      track.style.cursor = 'grabbing'
    }

    function onMouseMove(e) {
      if (!drag) return
      const now = Date.now()
      velocity = (e.clientX - lastDragX) / Math.max(1, now - lastDragTime) * 16
      lastDragX = e.clientX
      lastDragTime = now
      x = dragStartPos + (e.clientX - dragStartX)
    }

    function onMouseUp() {
      drag = false
      track.style.cursor = 'grab'
    }

    measure()
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    raf = requestAnimationFrame(loop)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
      track.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  // ── GSAP ScrollTrigger animations ────────────────────────────────────
  useEffect(() => {
    const init = () => {
      // Masked headings
      document.querySelectorAll('[data-mask]').forEach((grp) => {
        const inners = grp.querySelectorAll('.mask-inner')
        gsap.fromTo(inners,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.15, ease: 'power4.out', stagger: 0.11,
            scrollTrigger: { trigger: grp, start: 'top 86%', once: true } }
        )
      })

      // s-reveal elements
      document.querySelectorAll('.s-reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 52, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
            delay: parseFloat(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
        )
      })

      // Reasons slider — each panel (image + text) slides out left / in from right
      const reasonsStage = document.querySelector('.reasons-stage')
      if (reasonsStage) {
        const track  = reasonsStage.querySelector('.reasons-track')
        const panels = reasonsStage.querySelectorAll('.reason-panel')
        const n      = panels.length

        const tl = gsap.timeline()
        tl.fromTo(track, { xPercent: 0 }, { xPercent: -100 * (n - 1) / n, duration: 1, ease: 'none' })

        ScrollTrigger.create({
          trigger: reasonsStage,
          start: 'top top',
          end: '+=' + (n * 1000),
          pin: true,
          pinSpacing: true,
          scrub: 1,
          animation: tl,
        })
      }

      // Reasons slider — mobile (domed image crossfade + text slides left→right)
      const reasonsStageM = document.querySelector('.reasons-stage-m')
      if (reasonsStageM) {
        const imgs  = [...reasonsStageM.querySelectorAll('.reason-img-m')]
        const track = reasonsStageM.querySelector('.reasons-track-m')
        const n     = imgs.length
        gsap.set(imgs[0],       { opacity: 1 })
        gsap.set(imgs.slice(1), { opacity: 0 })

        const tlM = gsap.timeline()
        tlM.fromTo(track, { xPercent: 0 }, { xPercent: -100 * (n - 1) / n, duration: 1, ease: 'none' }, 0)
        // Crossfade the image at the midpoint between each pair of centered panels
        for (let i = 0; i < n - 1; i++) {
          const mid = (2 * i + 1) / (2 * (n - 1))
          tlM.to(imgs[i],     { opacity: 0, duration: 0.12, ease: 'power1.inOut' }, mid)
             .to(imgs[i + 1], { opacity: 1, duration: 0.12, ease: 'power1.inOut' }, mid)
        }

        ScrollTrigger.create({
          trigger: reasonsStageM, start: 'top top', end: '+=' + (n - 1) * 1150,
          pin: true, pinSpacing: true, scrub: 1, animation: tlM,
        })
      }

      // Perfect-for line wipe + content reveal
      document.querySelectorAll('.perfect-item').forEach((item, i) => {
        const line    = item.querySelector('.pf-line')
        const content = item.querySelector('.pf-content')
        if (!line || !content) return
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 82%', once: true },
        })
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power2.out', delay: i * 0.06 })
          .fromTo(content, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '-=0.28')
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      setTimeout(refresh, 700)
    }

    requestAnimationFrame(init)

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [isTouch])

  return (
    <div style={{background:'rgb(12,106,110)',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center'}}>

      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{position:'relative',width:'100%',height:'100vh',minHeight:860,flexShrink:0,overflow:'hidden',background:'rgb(12,106,110)',fontFamily:"'Manrope', sans-serif"}}>
        <div style={{position:'absolute',inset:0,zIndex:0,background:'rgb(12,106,110)'}}/>
        <canvas ref={canvasRef} style={{position:'absolute',inset:0,zIndex:0,width:'100%',height:'100%',display:'block'}}/>
        <div style={{position:'absolute',top:0,bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',zIndex:1}}>
          <Nav active="hotels" />
          <div style={{position:'absolute',zIndex:3,top:'50%',transform:'translateY(-50%)',left:28,right:28,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
            <span style={{fontFamily:"'Manrope', sans-serif",fontSize:16,fontWeight:400,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(236,226,206,0.9)',animation:'rise-in 1.1s cubic-bezier(0.16,1,0.3,1) 0.9s both'}}>FOR HOTELS</span>
            <h1 style={{margin:'16px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontStyle:'italic',fontSize:'clamp(56px, 7.4vw, 108px)',lineHeight:1.01,letterSpacing:'0.01em',color:'rgba(236,226,206,0.95)',animation:'rise-in 1.3s cubic-bezier(0.16,1,0.3,1) 1.1s both'}}>They came for the sun.</h1>
            <p style={{margin:'28px 0 0',maxWidth:580,fontFamily:"'Manrope', sans-serif",fontSize:17,lineHeight:1.65,color:'#f2eee6',opacity:0.88,animation:'rise-in 1.2s cubic-bezier(0.16,1,0.3,1) 1.5s both'}}>
              We make sure they leave talking about the massage.
            </p>
            <Link to="/contact" className="hero-cta" style={{marginTop:48,animation:'rise-in 1s cubic-bezier(0.16,1,0.3,1) 1.8s both'}}>PARTNER WITH US</Link>
          </div>
        </div>
      </section>

      {/* ===== MANIFESTO + GALLERY ===== */}
      <section ref={panelRef} style={{position:'relative',zIndex:2,flexShrink:0,width:'100%',background:'rgb(217,217,217)',borderTopLeftRadius:'50% 130px',borderTopRightRadius:'50% 130px',overflow:'hidden',fontFamily:"'Manrope', sans-serif",padding:'270px 0 0',marginTop:-24}}>

        {/* Manifesto */}
        <div style={{width:1344,maxWidth:'calc(100% - 120px)',margin:'0 auto',textAlign:'center'}}>
          <span className="eyebrow s-reveal">Why Aloha</span>
          <h2 data-mask style={{margin:'26px auto 0',maxWidth:860,fontFamily:"'Fraunces', serif",fontWeight:300,fontStyle:'italic',fontSize:'clamp(44px, 5vw, 72px)',lineHeight:1.08,letterSpacing:'0.015em',color:'rgb(12,106,110)'}}>
            <span className="mask-line"><span className="mask-inner">A wellness signature</span></span>
            <span className="mask-line"><span className="mask-inner">your guests carry home.</span></span>
          </h2>
          <p className="s-reveal" data-delay="0.15" style={{margin:'36px auto 0',maxWidth:700,fontFamily:"'Manrope', sans-serif",fontSize:19,lineHeight:1.72,color:'rgb(12,106,110)',opacity:0.8}}>
            Aloha brings a premium poolside massage concept directly to your property. We set up, we serve your guests, we pack up. You get five-star reviews about a wellness experience your guests never expected to find.
          </p>
        </div>

        {/* Infinite gallery */}
        <div className="gallery-outer" style={{marginTop:150,padding:'44px 0',overflow:'hidden',cursor:'grab',userSelect:'none'}}>
          <div ref={galleryRef} style={{display:'flex',gap:24,willChange:'transform',width:'max-content'}}>
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, i) => (
              <div key={i} style={{flexShrink:0,width:420,height:560,borderRadius:28,overflow:'hidden',background:'rgba(12,106,110,0.18)'}}>
                <img src={src} alt="" draggable={false} style={{width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none'}}/>
              </div>
            ))}
          </div>
        </div>

        {/* spacer */}
        <div style={{height:160}}/>
      </section>

      {/* ===== REASONS SLIDER — each panel slides out left / in from right ===== */}
      {isTouch ? (
        /* --- MOBILE: domed image top (crossfade), text slides horizontally (About-style) --- */
        <section className="reasons-stage-m" style={{width:'100%',height:'100vh',minHeight:720,flexShrink:0,position:'relative',overflow:'hidden',background:'rgb(217,217,217)',fontFamily:"'Manrope', sans-serif",display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'88px 28px',boxSizing:'border-box'}}>

          {/* Horizontal image with domed top edge — crossfades through reasons */}
          <div style={{position:'relative',width:'100%',maxWidth:520,height:'clamp(280px, 64vw, 400px)',borderRadius:'50% 50% 20px 20px / 34% 34% 20px 20px',overflow:'hidden',boxShadow:'0 22px 54px rgba(0,0,0,0.24)',flexShrink:0}}>
            {REASONS.map((r, i) => (
              <img key={r.num} className="reason-img-m" src={r.img} alt="" draggable={false} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none',opacity:i===0?1:0}}/>
            ))}
          </div>

          {/* Text viewport — track slides left→right on scroll */}
          <div className="reasons-text-vp-m" style={{position:'relative',marginTop:'clamp(56px, 10vw, 88px)',width:'100%',maxWidth:520,overflow:'hidden'}}>
            <div className="reasons-track-m" style={{display:'flex',width:`${REASONS.length*100}%`}}>
              {REASONS.map((r) => (
                <div key={r.num} style={{width:`${100/REASONS.length}%`,flexShrink:0,textAlign:'center',padding:'0 clamp(28px, 8vw, 48px)',boxSizing:'border-box'}}>
                  <span className="eyebrow" style={{display:'block',textAlign:'center'}}>{r.num} — {r.kicker}</span>
                  <h3 style={{margin:'30px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(34px, 9vw, 50px)',lineHeight:1.08,letterSpacing:'0.01em',color:'rgb(12,106,110)'}}>{r.title}</h3>
                  <p style={{margin:'30px 0 0',fontSize:16,lineHeight:1.8,color:'rgb(12,106,110)',opacity:0.82}}>{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* --- DESKTOP: image left, text right --- */
        <section className="reasons-stage" style={{width:'100%',height:'100vh',minHeight:720,flexShrink:0,position:'relative',overflow:'hidden',background:'rgb(217,217,217)',fontFamily:"'Manrope', sans-serif"}}>
          <div className="reasons-track" style={{position:'absolute',top:0,left:0,height:'100%',display:'flex',width:`${REASONS.length*100}%`,willChange:'transform'}}>
            {REASONS.map((r) => (
              <div key={r.num} className="reason-panel" style={{width:`${100/REASONS.length}%`,height:'100%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 28px',boxSizing:'border-box'}}>
                <div style={{width:1344,maxWidth:'100%',display:'grid',gridTemplateColumns:'1fr 1.06fr',gap:96,alignItems:'center'}}>

                  {/* Left: image */}
                  <div style={{position:'relative',height:'clamp(360px, 62vh, 620px)',borderRadius:'clamp(160px, 26vh, 280px) clamp(160px, 26vh, 280px) 14px 14px',overflow:'hidden',boxShadow:'0 30px 66px rgba(0,0,0,0.26)'}}>
                    <img src={r.img} alt="" draggable={false} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none'}}/>
                  </div>

                  {/* Right: text */}
                  <div>
                    <span className="eyebrow">{r.num} — {r.kicker}</span>
                    <h3 style={{margin:'24px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(40px, 4.2vw, 64px)',lineHeight:1.06,letterSpacing:'0.02em',color:'rgb(12,106,110)'}}>{r.title}</h3>
                    <p style={{margin:'34px 0 0',maxWidth:520,fontSize:19,lineHeight:1.78,color:'rgb(12,106,110)',opacity:0.82}}>{r.body}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== PERFECT FOR ===== */}
      <section style={{width:'100%',flexShrink:0,background:'rgb(217,217,217)',fontFamily:"'Manrope', sans-serif",padding:'150px 0 172px'}}>
        <div style={{width:1200,maxWidth:'calc(100% - 120px)',margin:'0 auto'}}>
          <span className="eyebrow s-reveal">Perfect for</span>
          <h3 data-mask style={{margin:'22px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(34px, 3.6vw, 52px)',lineHeight:1.1,letterSpacing:'0.02em',color:'rgb(12,106,110)'}}>
            <span className="mask-line"><span className="mask-inner">The right fit for</span></span>
            <span className="mask-line"><span className="mask-inner">the finest properties.</span></span>
          </h3>

          <div style={{marginTop:64}}>
            {PERFECT_FOR.map((item, i) => (
              <div key={item.label} className="perfect-item" style={{position:'relative',padding:'22px 0',display:'flex',flexDirection:'column',justifyContent:'flex-start'}}>
                <div className="pf-line" style={{position:'absolute',top:0,left:0,right:0,height:1,background:'rgba(12,106,110,0.32)',transformOrigin:'left center'}}/>
                <div className="pf-content" style={{display:'flex',alignItems:'center',gap:24,paddingTop:4}}>
                  <span className="pdot" style={{width:8,height:8,borderRadius:'50%',background:'rgb(12,106,110)',flexShrink:0,display:'block'}}/>
                  <span style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(26px, 2.8vw, 38px)',lineHeight:1.1,color:'rgb(12,106,110)',letterSpacing:'0.01em'}}>{item.label}</span>
                </div>
              </div>
            ))}
            {/* final line */}
            <div className="perfect-item" style={{position:'relative',padding:'0',height:1}}>
              <div className="pf-line" style={{position:'absolute',top:0,left:0,right:0,height:1,background:'rgba(12,106,110,0.32)',transformOrigin:'left center'}}/>
            </div>
          </div>

          <div className="s-reveal" data-delay="0.3" style={{marginTop:72,display:'flex',flexDirection:'column',alignItems:'flex-start',gap:22}}>
            <p style={{margin:0,maxWidth:640,fontFamily:"'Manrope', sans-serif",fontSize:18,lineHeight:1.68,color:'rgb(12,106,110)',opacity:0.78}}>Ready to bring Aloha Massage to your property? We'd love to start a conversation — no strings attached.</p>
            <Link to="/contact" className="pill-btn">GET IN TOUCH</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
