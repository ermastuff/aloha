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

export default function About() {
  const heroRef   = useRef(null)
  const canvasRef = useRef(null)
  const panelRef  = useRef(null)

  useWaterCanvas(heroRef, canvasRef)
  useCurvedPanel(panelRef)
  const isTouch = useIsTouch()

  useEffect(() => {
    // Give DOM time to settle before measuring
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

      // Story slider
      const stage = document.querySelector('.story-stage')
      if (stage) {
        const imgs  = [...stage.querySelectorAll('.story-img')]
        const track = stage.querySelector('.story-text-track')
        gsap.set(imgs[0], { opacity: 1 })
        gsap.set(imgs.slice(1), { opacity: 0 })

        const tl = gsap.timeline()
        tl.fromTo(track, { yPercent: 0 }, { yPercent: -66.667, duration: 1, ease: 'none' }, 0)
          .to(imgs[0], { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 0.15)
          .to(imgs[1], { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 0.15)
          .to(imgs[1], { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 0.65)
          .to(imgs[2], { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 0.65)

        ScrollTrigger.create({
          trigger: stage, start: 'top top', end: '+=3000',
          pin: true, pinSpacing: true, scrub: 1, animation: tl,
        })
      }

      // Story slider — mobile (image top with dome, text slides left→right)
      const stageM = document.querySelector('.story-stage-m')
      if (stageM) {
        const imgs  = [...stageM.querySelectorAll('.story-img-m')]
        const track = stageM.querySelector('.story-text-track-m')
        const n     = 3
        gsap.set(imgs[0],       { opacity: 1 })
        gsap.set(imgs.slice(1), { opacity: 0 })

        const tlM = gsap.timeline()
        // Text track slides horizontally: each block exits left, next enters from right
        tlM.fromTo(track, { xPercent: 0 }, { xPercent: -100 * (n - 1) / n, duration: 1, ease: 'none' }, 0)
           // Image crossfades in sync with each panel landing centered
           .to(imgs[0], { opacity: 0, duration: 0.18, ease: 'power1.inOut' }, 0.25)
           .to(imgs[1], { opacity: 1, duration: 0.18, ease: 'power1.inOut' }, 0.25)
           .to(imgs[1], { opacity: 0, duration: 0.18, ease: 'power1.inOut' }, 0.75)
           .to(imgs[2], { opacity: 1, duration: 0.18, ease: 'power1.inOut' }, 0.75)

        ScrollTrigger.create({
          trigger: stageM, start: 'top top', end: '+=2300',
          pin: true, pinSpacing: true, scrub: 1, animation: tlM,
        })
      }

      // Hotels full-bleed image
      const hstage = document.querySelector('.hotels-stage')
      if (hstage) {
        const lines = hstage.querySelectorAll('.ht-reveal')
        const btn   = hstage.querySelector('.ht-btn')
        gsap.set(lines, { opacity: 0, y: 52 })
        if (btn) gsap.set(btn, { opacity: 0, y: 52 })

        const lead    = isTouch ? 0.18 : 1
        const endDist = isTouch ? 1000 : 1900

        const tl2 = gsap.timeline()
        tl2.to({}, { duration: lead }, 0)
           .to(lines, { opacity: 1, y: 0, duration: 0.9, stagger: 0.16, ease: 'power3.out' }, lead)
        if (btn) tl2.to(btn, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, lead + 0.45)

        ScrollTrigger.create({
          trigger: hstage, start: 'top top', end: '+=' + endDist,
          pin: true, pinSpacing: true, scrub: 1.6, animation: tl2,
        })
      }

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      document.querySelectorAll('img').forEach((im) => {
        if (!im.complete) im.addEventListener('load', refresh)
      })
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
          <Nav active="about" />
          <div style={{position:'absolute',zIndex:3,top:'50%',transform:'translateY(-50%)',left:28,right:28,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
            <span style={{fontFamily:"'Manrope', sans-serif",fontSize:16,fontWeight:400,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(236,226,206,0.9)',animation:'rise-in 1.1s cubic-bezier(0.16,1,0.3,1) 0.9s both'}}>ABOUT US</span>
            <h1 style={{margin:'16px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:92,lineHeight:1,letterSpacing:'0.04em',color:'rgba(236,226,206,0.95)',animation:'rise-in 1.3s cubic-bezier(0.16,1,0.3,1) 1.1s both'}}>OUR STORY</h1>
            <p style={{margin:'28px 0 0',maxWidth:620,fontFamily:"'Manrope', sans-serif",fontSize:17,lineHeight:1.65,letterSpacing:'0.01em',color:'#f2eee6',opacity:0.92,animation:'rise-in 1.2s cubic-bezier(0.16,1,0.3,1) 1.5s both'}}>
              More than a massage — a way to bring island calm to your holiday, right where the water meets the sun.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ABOUT PANEL ===== */}
      <section ref={panelRef} style={{position:'relative',zIndex:2,flexShrink:0,width:'100%',marginTop:-24,background:'rgb(217,217,217)',borderTopLeftRadius:'50% 130px',borderTopRightRadius:'50% 130px',overflow:'hidden',fontFamily:"'Manrope', sans-serif",padding:'232px 0 268px'}}>
        <div style={{width:880,maxWidth:'calc(100% - 120px)',margin:'0 auto',textAlign:'center'}}>
          <span className="eyebrow s-reveal">Who we are</span>
          <h2 data-mask style={{margin:'26px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontStyle:'italic',fontSize:'clamp(46px, 5.2vw, 74px)',lineHeight:1.08,letterSpacing:'0.02em',color:'rgb(12,106,110)'}}>
            <span className="mask-line"><span className="mask-inner">Born from island light,</span></span>
            <span className="mask-line"><span className="mask-inner">and the quiet of water.</span></span>
          </h2>
          <p className="s-reveal" data-delay="0.15" style={{margin:'36px auto 0',maxWidth:720,fontFamily:"'Manrope', sans-serif",fontSize:19,lineHeight:1.72,color:'rgb(12,106,110)',opacity:0.82}}>
            Aloha Massage is a premium poolside wellness concept — inspired by island living, deep relaxation and the grace of true hospitality. We exist for one moment in particular: the breath a guest lets go when they finally decide the holiday has truly begun.
          </p>
        </div>
      </section>

      {/* ===== STORY SLIDER ===== */}
      {isTouch ? (
        /* --- MOBILE: domed image top, text slides horizontally --- */
        <section className="story-stage-m" style={{width:'100%',height:'100vh',minHeight:720,flexShrink:0,position:'relative',overflow:'hidden',background:'rgb(217,217,217)',fontFamily:"'Manrope', sans-serif",display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'88px 28px',boxSizing:'border-box'}}>

          {/* Horizontal image with domed top edge */}
          <div style={{position:'relative',width:'100%',maxWidth:520,height:'clamp(280px, 64vw, 400px)',borderRadius:'50% 50% 20px 20px / 34% 34% 20px 20px',overflow:'hidden',boxShadow:'0 22px 54px rgba(0,0,0,0.24)',flexShrink:0}}>
            <img className="story-img-m" src="/assets/hero-massage.png" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:1}}/>
            <img className="story-img-m" src="/assets/card-natural.jpg" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0}}/>
            <img className="story-img-m" src="/assets/card-island.jpg"  alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0}}/>
          </div>

          {/* Text viewport — track slides left→right on scroll */}
          <div className="story-text-vp-m" style={{position:'relative',marginTop:'clamp(56px, 10vw, 88px)',width:'100%',maxWidth:520,overflow:'hidden'}}>
            <div className="story-text-track-m" style={{display:'flex',width:'300%'}}>

              <div style={{width:'33.333%',flexShrink:0,textAlign:'center',padding:'0 clamp(28px, 8vw, 48px)',boxSizing:'border-box'}}>
                <span className="eyebrow" style={{display:'block',textAlign:'center'}}>01 — The concept</span>
                <h3 style={{margin:'30px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(34px, 9vw, 50px)',lineHeight:1.08,letterSpacing:'0.01em',color:'rgb(12,106,110)'}}>A poolside,<br/>reimagined.</h3>
                <p style={{margin:'30px 0 0',fontSize:16,lineHeight:1.8,color:'rgb(12,106,110)',opacity:0.82}}>Aloha Massage is a premium poolside wellness concept, inspired by island living and the grace of true hospitality — turning an ordinary stretch of poolside into an elegant wellness corner made for slowing down.</p>
              </div>

              <div style={{width:'33.333%',flexShrink:0,textAlign:'center',padding:'0 clamp(28px, 8vw, 48px)',boxSizing:'border-box'}}>
                <span className="eyebrow" style={{display:'block',textAlign:'center'}}>02 — The ritual</span>
                <h3 style={{margin:'30px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(34px, 9vw, 50px)',lineHeight:1.08,letterSpacing:'0.01em',color:'rgb(12,106,110)'}}>Calm, comfort,<br/>escape.</h3>
                <p style={{margin:'30px 0 0',fontSize:16,lineHeight:1.8,color:'rgb(12,106,110)',opacity:0.82}}>Through professional massage and a refined tropical setup, we create an atmosphere of pure calm and comfort — the quiet escape that every great holiday is quietly remembered for.</p>
              </div>

              <div style={{width:'33.333%',flexShrink:0,textAlign:'center',padding:'0 clamp(28px, 8vw, 48px)',boxSizing:'border-box'}}>
                <span className="eyebrow" style={{display:'block',textAlign:'center'}}>03 — Our mission</span>
                <h3 style={{margin:'30px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(34px, 9vw, 50px)',lineHeight:1.08,letterSpacing:'0.01em',color:'rgb(12,106,110)'}}>Wellness,<br/>brought to you.</h3>
                <p style={{margin:'30px 0 0',fontSize:16,lineHeight:1.8,color:'rgb(12,106,110)',opacity:0.82}}>Instead of asking you to go to the spa, we bring the experience to where you already feel most relaxed — beside the pool, under the sun.</p>
                <Link to="/treatments" className="pill-btn" style={{marginTop:30,display:'inline-flex'}}>EXPLORE TREATMENTS</Link>
              </div>

            </div>
          </div>
        </section>
      ) : (
        /* --- DESKTOP: image left, text track right --- */
        <section className="story-stage" style={{width:'100%',height:'100vh',minHeight:720,flexShrink:0,position:'relative',overflow:'hidden',background:'rgb(217,217,217)',fontFamily:"'Manrope', sans-serif"}}>
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:1344,maxWidth:'calc(100% - 130px)',display:'grid',gridTemplateColumns:'1fr 1.06fr',gap:96,alignItems:'center'}}>

              {/* Left: image stack */}
              <div style={{position:'relative',height:'clamp(360px, 62vh, 620px)',borderRadius:'clamp(160px, 26vh, 280px) clamp(160px, 26vh, 280px) 14px 14px',overflow:'hidden',boxShadow:'0 30px 66px rgba(0,0,0,0.26)'}}>
                <img className="story-img" src="/assets/hero-massage.png" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:1}}/>
                <img className="story-img" src="/assets/card-natural.jpg" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0}}/>
                <img className="story-img" src="/assets/card-island.jpg"  alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0}}/>
              </div>

              {/* Right: text track */}
              <div style={{position:'relative',height:'clamp(360px, 62vh, 620px)',overflow:'hidden'}}>
                <div className="story-text-track" style={{position:'absolute',left:0,right:0,top:0}}>

                  <div style={{height:'clamp(360px, 62vh, 620px)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <span className="eyebrow">01 — The concept</span>
                    <h3 style={{margin:'24px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(40px, 4.2vw, 64px)',lineHeight:1.06,letterSpacing:'0.02em',color:'rgb(12,106,110)'}}>A poolside,<br/>reimagined.</h3>
                    <p style={{margin:'34px 0 0',maxWidth:520,fontSize:19,lineHeight:1.78,color:'rgb(12,106,110)',opacity:0.82}}>Aloha Massage is a premium poolside wellness concept, inspired by island living and the grace of true hospitality — turning an ordinary stretch of poolside into an elegant wellness corner made for slowing down.</p>
                  </div>

                  <div style={{height:'clamp(360px, 62vh, 620px)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <span className="eyebrow">02 — The ritual</span>
                    <h3 style={{margin:'24px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(40px, 4.2vw, 64px)',lineHeight:1.06,letterSpacing:'0.02em',color:'rgb(12,106,110)'}}>Calm, comfort,<br/>escape.</h3>
                    <p style={{margin:'34px 0 0',maxWidth:520,fontSize:19,lineHeight:1.78,color:'rgb(12,106,110)',opacity:0.82}}>Through professional massage and a refined tropical setup, we create an atmosphere of pure calm and comfort — the quiet escape that every great holiday is quietly remembered for.</p>
                  </div>

                  <div style={{height:'clamp(360px, 62vh, 620px)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <span className="eyebrow">03 — Our mission</span>
                    <h3 style={{margin:'24px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(40px, 4.2vw, 64px)',lineHeight:1.06,letterSpacing:'0.02em',color:'rgb(12,106,110)'}}>Wellness,<br/>brought to you.</h3>
                    <p style={{margin:'34px 0 0',maxWidth:520,fontSize:19,lineHeight:1.78,color:'rgb(12,106,110)',opacity:0.82}}>Instead of asking you to go to the spa, we bring the experience to where you already feel most relaxed — beside the pool, under the sun. The treatment comes to the lounger; all you have to do is stay.</p>
                    <Link to="/treatments" className="pill-btn" style={{marginTop:40,alignSelf:'flex-start'}}>EXPLORE TREATMENTS</Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== HOTELS FULL-BLEED IMAGE ===== */}
      <section className="hotels-stage" style={{width:'100%',height:'100vh',minHeight:720,flexShrink:0,position:'relative',overflow:'hidden',background:'rgb(12,106,110)',fontFamily:"'Manrope', sans-serif"}}>
        <img className="hotels-img" src="/assets/card-hotels.jpg" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(8,52,54,0.12) 0%, rgba(8,52,54,0.34) 52%, rgba(8,52,54,0.7) 100%)'}}/>
        {isTouch ? (
          /* --- MOBILE: centered text + button --- */
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',textAlign:'center',padding:'0 28px clamp(72px, 12vh, 110px)',boxSizing:'border-box'}}>
            <span className="eyebrow ht-reveal" style={{color:'#f2eee6',opacity:0.85,display:'block',textAlign:'center'}}>For hotels</span>
            <h3 className="ht-reveal" style={{margin:'22px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(38px, 9vw, 54px)',lineHeight:1.08,letterSpacing:'0.02em',color:'#f2eee6'}}>A signature your<br/>guests remember.</h3>
            <p className="ht-reveal" style={{margin:'24px auto 0',maxWidth:460,fontSize:16,lineHeight:1.74,color:'rgba(242,238,230,0.92)'}}>Bring the Aloha experience to your guests — a refined wellness signature that asks almost nothing of your team, and gives your resort something they will remember.</p>
            <Link to="/hotels" className="ht-btn pill-btn-cream" style={{marginTop:36}}>FOR HOTELS</Link>
          </div>
        ) : (
          /* --- DESKTOP: text bottom-left, button bottom-right --- */
          <>
            <div style={{position:'absolute',left:'calc(50% - 672px)',bottom:80,maxWidth:660}}>
              <span className="eyebrow ht-reveal" style={{color:'#f2eee6',opacity:0.85}}>For hotels</span>
              <h3 className="ht-reveal" style={{margin:'20px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(38px, 4vw, 58px)',lineHeight:1.08,letterSpacing:'0.02em',color:'#f2eee6'}}>A signature your<br/>guests remember.</h3>
              <p className="ht-reveal" style={{margin:'26px 0 0',maxWidth:560,fontSize:18,lineHeight:1.74,color:'rgba(242,238,230,0.92)'}}>Bring the Aloha experience to your guests — a refined wellness signature that asks almost nothing of your team, and gives your resort something they will remember.</p>
            </div>
            <Link to="/hotels" className="ht-btn pill-btn-cream" style={{position:'absolute',right:'calc(50% - 672px)',bottom:92}}>FOR HOTELS</Link>
          </>
        )}
      </section>

      {/* ===== DESIGNED TO ===== */}
      <section style={{width:'100%',flexShrink:0,background:'rgb(217,217,217)',fontFamily:"'Manrope', sans-serif",padding:'150px 0 172px'}}>
        <div style={{width:1344,maxWidth:'calc(100% - 120px)',margin:'0 auto'}}>
          <div style={{maxWidth:760}}>
            <span className="eyebrow s-reveal">Designed to</span>
            <h3 data-mask style={{margin:'22px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(34px, 3.6vw, 52px)',lineHeight:1.1,letterSpacing:'0.02em',color:'rgb(12,106,110)'}}>
              <span className="mask-line"><span className="mask-inner">A quiet luxury, felt</span></span>
              <span className="mask-line"><span className="mask-inner">across the whole resort.</span></span>
            </h3>
          </div>
          <div style={{marginTop:56,borderTop:'1px solid rgba(12,106,110,0.24)'}}>
            {[
              [1,'Deepen guest satisfaction at every stay'],
              [2,'Elevate the perceived value of the hotel'],
              [3,'Turn an ordinary stay into a lasting memory'],
              [4,'Add a true wellness signature to the resort'],
              [5,'Deliver a premium service with minimal operational lift'],
            ].map(([n, text]) => (
              <div key={n} className="b-row s-reveal" style={{display:'flex',alignItems:'baseline',gap:44,padding:'30px 22px',borderBottom:'1px solid rgba(12,106,110,0.24)'}}>
                <span className="bnum" style={{fontSize:26,color:'rgb(12,106,110)',opacity:0.5,minWidth:52}}>0{n}</span>
                <span style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(24px, 2.4vw, 34px)',lineHeight:1.2,color:'rgb(12,106,110)'}}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
