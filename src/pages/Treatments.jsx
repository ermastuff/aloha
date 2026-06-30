import { useRef, useEffect, useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { useWaterCanvas } from '../hooks/useWaterCanvas.js'
import { useCurvedPanel } from '../hooks/useCurvedPanel.js'

const TREATMENTS = [
  {
    category: 'CLASSIC MASSAGES',
    items: [
      { name: 'Aloha Relax', price: '30 min | 35€  •  55 min | 60€  •  75 min | 80€', desc: 'A soothing, gentle and deeply relaxing massage. Perfect to melt away stress, clear your mind and restore harmony under the island breeze.' },
      { name: 'Deep Waves', price: '30 min | 40€  •  55 min | 70€  •  75 min | 90€', desc: 'Deep and targeted techniques to release muscle tension, knots and stiffness. Relaxes the muscles, restoring lightness and freedom of movement.' },
      { name: 'Ocean Sport Massage', price: '30 min | 55€  •  55 min | 70€  •  75 min | 90€', desc: 'The perfect treatment for athletes, surfers and active people. Improves circulation, reduces post-workout tension and supports full recovery. Energizing, technical and revitalizing.' },
    ],
  },
  {
    category: 'WELLNESS',
    items: [
      { name: 'Lomi Lomi Hawaii', price: '60 min | 75€  •  75 min | 95€', desc: 'Long, flowing and enveloping movements inspired by the ocean waves. Rebalances body and mind, offering a deep sense of harmony.' },
    ],
  },
  {
    category: 'TARGETED TREATMENTS',
    items: [
      { name: 'Back & Neck Release', price: '25 min | 35€', desc: 'Perfect for relieving tension in the back, neck and shoulders. A quick and effective treatment to restore lightness.' },
      { name: 'Leg Recovery', price: '25 min | 35€', desc: 'A draining and light massage, ideal for tired legs, swelling and heaviness. Perfect after walks, hikes or hot days.' },
      { name: 'Head Massage', price: '25 min | 35€', desc: 'A relaxing treatment that relieves tension in the head, scalp and neck. Ideal to relax the mind and provide an immediate feeling of relaxation.' },
    ],
  },
  {
    category: 'ALOE-BASED TREATMENTS',
    items: [
      { name: 'Aloe After-Sun Soothing', price: '30 min | 45€', desc: 'Soothing body treatment with pure Aloe Vera from the Canary Islands. Calms the skin after sun exposure and reduces redness, leaving an immediate feeling of freshness.' },
      { name: 'Aloe Face Express', price: '25 min | 30€', desc: 'Quick and refreshing facial treatment with pure Aloe Vera. Reduces redness, hydrates and enhances your natural radiance.' },
    ],
  },
]

export default function Treatments() {
  const heroRef     = useRef(null)
  const canvasRef   = useRef(null)
  const panelRef    = useRef(null)
  const addonRef    = useRef(null)
  const launcherRef = useRef(null)

  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [entered, setEntered] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useWaterCanvas(heroRef, canvasRef)
  useCurvedPanel(panelRef)

  // Floating launcher that parks above the footer
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 2000)

    function update() {
      const vh = window.innerHeight || 800
      setScrolled((window.scrollY || 0) > vh * 0.55)

      const launcher = launcherRef.current
      const addon    = addonRef.current
      if (launcher && addon) {
        const floatGap   = 72
        const gap        = 72   // space between add-on box bottom and the button
        const btnH       = launcher.offsetHeight || 56
        // Park the button just below the add-on box; otherwise float at viewport bottom.
        const addonBottom  = addon.getBoundingClientRect().bottom
        const parkedBottom = vh - (addonBottom + gap + btnH)
        launcher.style.bottom = Math.max(floatGap, parkedBottom) + 'px'
      }
    }

    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = null; update() })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const launcherClass = [
    scrolled ? 'compact' : '',
    open     ? 'hidden'  : '',
    entered  ? ''        : 'intro',
  ].filter(Boolean).join(' ')

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{background:'rgb(12,106,110)',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center'}}>

      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{position:'relative',width:'100%',height:'100vh',minHeight:860,flexShrink:0,overflow:'hidden',background:'rgb(12,106,110)',fontFamily:"'Manrope', sans-serif"}}>
        <div style={{position:'absolute',inset:0,zIndex:0,background:'rgb(12,106,110)'}}/>
        <canvas ref={canvasRef} style={{position:'absolute',inset:0,zIndex:0,width:'100%',height:'100%',display:'block'}}/>
        <div style={{position:'absolute',top:0,bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',zIndex:1}}>
          <Nav active="treatments" />
          <div style={{position:'absolute',zIndex:3,top:'50%',transform:'translateY(-50%)',left:28,right:28,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
            <span style={{fontFamily:"'Manrope', sans-serif",fontSize:16,fontWeight:400,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(236,226,206,0.9)',animation:'rise-in 1.1s cubic-bezier(0.16,1,0.3,1) 0.9s both'}}>TREATMENTS</span>
            <h1 style={{margin:'16px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:92,lineHeight:1,letterSpacing:'0.04em',color:'rgba(236,226,206,0.95)',animation:'rise-in 1.3s cubic-bezier(0.16,1,0.3,1) 1.1s both'}}>ALOHA MENU</h1>
            <p style={{margin:'28px 0 0',maxWidth:640,fontFamily:"'Manrope', sans-serif",fontSize:17,lineHeight:1.65,letterSpacing:'0.01em',color:'#f2eee6',opacity:0.92,animation:'rise-in 1.2s cubic-bezier(0.16,1,0.3,1) 1.5s both'}}>
              Choose from our wide range of spa treatments! From deeply relaxing hot stone massage to facials, hair spa, luxury scrubs and wraps for your ultimate rejuvenating experience.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TREATMENTS MENU PANEL ===== */}
      <section ref={panelRef} style={{position:'relative',zIndex:2,flexShrink:0,width:'100%',marginTop:-24,background:'rgb(217,217,217)',borderTopLeftRadius:'50% 130px',borderTopRightRadius:'50% 130px',overflow:'hidden',fontFamily:"'Manrope', sans-serif",padding:'210px 0 200px'}}>
        <div className="treat-inner" style={{width:1344,maxWidth:'calc(100% - 120px)',margin:'0 auto'}}>

          {TREATMENTS.map(({ category, items }, ci) => (
            <div key={category}>
              <div className="reveal-up" style={{display:'flex',alignItems:'center',gap:32,margin:`${ci===0?0:72}px 0 14px`}}>
                <span style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(16px, 4vw, 30px)',letterSpacing:'0.12em',color:'rgb(12,106,110)',wordBreak:'break-word'}}>{category}</span>
                <div style={{flex:1,height:1,background:'rgba(12,106,110,0.4)'}}/>
              </div>
              {items.map((item, ii) => (
                <div key={item.name} className={`reveal-up treat-row`} style={{transitionDelay:`${ii*0.06}s`,padding:'24px 4px',borderBottom:'1px solid rgba(12,106,110,0.18)'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <h3 className="treat-name" style={{margin:0,fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(18px, 4vw, 28px)',letterSpacing:'0.02em',color:'rgb(12,106,110)',lineHeight:1.2}}>{item.name}</h3>
                    <span style={{fontFamily:"'Manrope', sans-serif",fontSize:'clamp(11px, 2.2vw, 16px)',fontWeight:500,color:'rgb(12,106,110)',opacity:0.85,whiteSpace:'nowrap',textAlign:'left'}}>{item.price}</span>
                  </div>
                  <p style={{margin:'10px 0 0',fontSize:16,lineHeight:1.6,color:'rgb(12,106,110)',opacity:0.72,maxWidth:780}}>{item.desc}</p>
                </div>
              ))}
            </div>
          ))}

          {/* Add-ons */}
          <div ref={addonRef} className="reveal-up" style={{marginTop:64,border:'1px solid rgba(12,106,110,0.4)',borderRadius:28,padding:'34px 42px'}}>
            <div style={{display:'flex',alignItems:'baseline',flexWrap:'wrap',gap:14,marginBottom:20}}>
              <span style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:26,letterSpacing:'0.1em',color:'rgb(12,106,110)'}}>ADD-ONS</span>
              <span style={{fontFamily:"'Manrope', sans-serif",fontSize:13,letterSpacing:'0.06em',color:'rgb(12,106,110)',opacity:0.7,textTransform:'uppercase'}}>(to add to any treatment)</span>
            </div>
            {[
              { name:'Tropical Aromatherapy', price:'+5€', desc:'Exotic fragrances and essential oils that enhance relaxation and overall well-being.' },
              { name:'Warm Coconut Oil',       price:'+5€', desc:'Nourishing, gentle and perfect for those who love a silky, luxurious feel on the skin.' },
            ].map((addon) => (
              <div key={addon.name} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:40,padding:'16px 0',borderTop:'1px solid rgba(12,106,110,0.16)'}}>
                <div>
                  <div style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:21,color:'rgb(12,106,110)'}}>{addon.name}</div>
                  <p style={{margin:'6px 0 0',fontSize:15,lineHeight:1.55,color:'rgb(12,106,110)',opacity:0.72,maxWidth:560}}>{addon.desc}</p>
                </div>
                <div style={{flexShrink:0,fontFamily:"'Manrope', sans-serif",fontSize:19,fontWeight:700,color:'rgb(12,106,110)'}}>{addon.price}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Floating booking launcher (parks above the footer) */}
      <button
        ref={launcherRef}
        className={`book-launcher ${launcherClass}`}
        onClick={() => setOpen(true)}
        style={{bottom:'72px'}}
      >
        <span className="lbl-hero">SCROLL TO SEE THE TREATMENTS</span>
        <span className="lbl-book">BOOK YOUR EXPERIENCE</span>
      </button>

      {/* Booking modal */}
      <div className={`book-overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)}>
        <div className="book-modal" onClick={(e) => e.stopPropagation()}>
          <button className="bk-close" onClick={() => { setOpen(false); setSubmitted(false) }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
            </svg>
          </button>
          {!submitted ? (
            <>
              <div style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:30,letterSpacing:'0.04em',color:'rgb(12,106,110)',marginBottom:26,textAlign:'center'}}>Book your experience</div>
              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:24,textAlign:'left'}}>
                <div className="bk-grid">
                  <div className="bk-field"><label className="bk-label">Nome</label><input className="bk-input" type="text" name="nome" placeholder="Your first name" required/></div>
                  <div className="bk-field"><label className="bk-label">Cognome</label><input className="bk-input" type="text" name="cognome" placeholder="Your last name" required/></div>
                  <div className="bk-field"><label className="bk-label">Email</label><input className="bk-input" type="email" name="email" placeholder="you@email.com" required/></div>
                  <div className="bk-field"><label className="bk-label">Phone number</label><input className="bk-input" type="tel" name="phone" placeholder="+34 600 000 000" required/></div>
                </div>
                <div className="bk-field">
                  <label className="bk-label">Treatment</label>
                  <select className="bk-input" name="treatment" required defaultValue="">
                    <option value="" disabled>Select a treatment</option>
                    <optgroup label="Classic Massages">
                      <option>Aloha Relax</option>
                      <option>Deep Waves</option>
                      <option>Ocean Sport Massage</option>
                    </optgroup>
                    <optgroup label="Wellness">
                      <option>Lomi Lomi Hawaii</option>
                    </optgroup>
                    <optgroup label="Targeted Treatments">
                      <option>Back &amp; Neck Release</option>
                      <option>Leg Recovery</option>
                      <option>Head Massage</option>
                    </optgroup>
                    <optgroup label="Aloe-Based Treatments">
                      <option>Aloe After-Sun Soothing</option>
                      <option>Aloe Face Express</option>
                    </optgroup>
                  </select>
                </div>
                <div className="bk-field"><label className="bk-label">Preferred date</label><input className="bk-input" type="date" name="date" required/></div>
                <button type="submit" className="pill-btn" style={{alignSelf:'center',marginTop:8}}>SEND REQUEST</button>
              </form>
            </>
          ) : (
            <div style={{textAlign:'center',padding:'24px 0'}}>
              <div style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:34,letterSpacing:'0.04em',color:'rgb(12,106,110)'}}>Thank you!</div>
              <p style={{margin:'16px auto 0',maxWidth:460,fontFamily:"'Manrope', sans-serif",fontSize:16,lineHeight:1.6,color:'rgb(12,106,110)',opacity:0.75}}>We've received your request and will get back to you shortly to confirm your poolside experience.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
