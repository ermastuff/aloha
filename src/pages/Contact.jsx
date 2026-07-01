import { useRef, useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { useWaterCanvas } from '../hooks/useWaterCanvas.js'
import { useCurvedPanel } from '../hooks/useCurvedPanel.js'

export default function Contact() {
  const heroRef   = useRef(null)
  const canvasRef = useRef(null)
  const panelRef  = useRef(null)

  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useWaterCanvas(heroRef, canvasRef)
  useCurvedPanel(panelRef)

  async function handleSubmit(e) {
    e.preventDefault()
    if (sending) return
    const fd = new FormData(e.currentTarget)
    const payload = {
      formType: 'contact',
      nome: fd.get('nome'),
      cognome: fd.get('cognome'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      message: fd.get('message'),
    }
    setSending(true)
    setError('')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data.error || 'Request failed')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{background:'rgb(12,106,110)',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center'}}>

      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{position:'relative',width:'100%',height:'72vh',minHeight:620,flexShrink:0,overflow:'hidden',background:'rgb(12,106,110)',fontFamily:"'Manrope', sans-serif"}}>
        <div style={{position:'absolute',inset:0,zIndex:0,background:'rgb(12,106,110)'}}/>
        <canvas ref={canvasRef} style={{position:'absolute',inset:0,zIndex:0,width:'100%',height:'100%',display:'block'}}/>
        <div style={{position:'absolute',top:0,bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',zIndex:1}}>
          <Nav active="contact" />
          <div style={{position:'absolute',zIndex:3,top:'50%',transform:'translateY(-50%)',left:28,right:28,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
            <span style={{fontFamily:"'Manrope', sans-serif",fontSize:16,fontWeight:400,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(236,226,206,0.9)',animation:'rise-in 1.1s cubic-bezier(0.16,1,0.3,1) 0.9s both'}}>CONTACT</span>
            <h1 className="contact-hero-title" style={{margin:'22px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(40px, 7.4vw, 104px)',lineHeight:1.08,letterSpacing:'0.14em',color:'rgba(236,226,206,0.95)',animation:'rise-in 1.3s cubic-bezier(0.16,1,0.3,1) 1.1s both'}}>Escape. Relax. Recharge.</h1>
          </div>
        </div>
      </section>

      {/* ===== CONTACT PANEL ===== */}
      <section ref={panelRef} style={{position:'relative',zIndex:2,flexShrink:0,width:'100%',marginTop:-24,background:'rgb(217,217,217)',borderTopLeftRadius:'50% 130px',borderTopRightRadius:'50% 130px',overflow:'hidden',fontFamily:"'Manrope', sans-serif",padding:'210px 0 150px'}}>
        <div className="contact-grid" style={{width:1344,maxWidth:'calc(100% - 120px)',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:96,alignItems:'start'}}>

          {/* LEFT — INFO */}
          <div className="reveal-up" style={{display:'flex',flexDirection:'column'}}>

            <span style={{fontFamily:"'Manrope', sans-serif",fontSize:13,fontWeight:600,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgb(12,106,110)',opacity:0.7}}>Get in touch</span>

            <h2 style={{margin:'18px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(38px, 9vw, 54px)',lineHeight:1.05,letterSpacing:'0.04em',color:'rgb(12,106,110)'}}>ALOHA MASSAGE</h2>
            <p style={{margin:'10px 0 0',fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(20px, 5.5vw, 26px)',letterSpacing:'0.08em',color:'rgb(12,106,110)',opacity:0.85}}>Poolside Wellness</p>

            <div style={{height:1,background:'rgba(12,106,110,0.3)',margin:'38px 0'}}/>

            <span style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(22px, 6vw, 30px)',letterSpacing:'0.04em',color:'rgb(12,106,110)'}}>Gran Canaria &bull; Fuerteventura</span>

            <div style={{marginTop:42}}>
              <span style={{fontFamily:"'Manrope', sans-serif",fontSize:13,fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgb(12,106,110)',opacity:0.7}}>Instagram</span>
              <div style={{display:'flex',alignItems:'center',gap:16,marginTop:14}}>
                <svg viewBox="0 0 48 48" style={{width:34,height:34,flexShrink:0,fill:'none',stroke:'rgb(12,106,110)',strokeWidth:2.4}}>
                  <rect x="6" y="6" width="36" height="36" rx="11"/>
                  <circle cx="24" cy="24" r="9"/>
                  <circle cx="35" cy="13" r="2" fill="rgb(12,106,110)" stroke="none"/>
                </svg>
                <span className="ig-handle" style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(18px, 4.8vw, 28px)',letterSpacing:'0.02em',color:'rgb(12,106,110)',lineHeight:1.1,textTransform:'none',wordBreak:'break-word'}}>@alohamassage.poolsidewellness</span>
              </div>
            </div>

          </div>

          {/* RIGHT — FORM */}
          <div className="reveal-up" style={{transitionDelay:'0.12s'}}>
            {!submitted ? (
              <>
                <div style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(26px, 7vw, 34px)',letterSpacing:'0.03em',color:'rgb(12,106,110)',marginBottom:30}}>Send us a message</div>
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:26}}>
                  <div className="bk-grid">
                    <div className="bk-field"><label className="bk-label">Nome</label><input className="bk-input" type="text" name="nome" placeholder="Your first name" required/></div>
                    <div className="bk-field"><label className="bk-label">Cognome</label><input className="bk-input" type="text" name="cognome" placeholder="Your last name" required/></div>
                    <div className="bk-field"><label className="bk-label">Email</label><input className="bk-input" type="email" name="email" placeholder="you@email.com" required/></div>
                    <div className="bk-field"><label className="bk-label">Phone number</label><input className="bk-input" type="tel" name="phone" placeholder="+34 600 000 000"/></div>
                  </div>
                  <div className="bk-field">
                    <label className="bk-label">Message</label>
                    <textarea className="bk-input" name="message" rows={4} placeholder="Tell us how we can help you relax…" required style={{minHeight:96}}/>
                  </div>
                  {error && <p style={{margin:0,color:'#b23a3a',fontSize:14}}>{error}</p>}
                  <button type="submit" className="pill-btn" disabled={sending} style={{alignSelf:'flex-start',marginTop:6,opacity:sending?0.6:1,cursor:sending?'default':'pointer'}}>{sending ? 'SENDING…' : 'SEND MESSAGE'}</button>
                </form>
              </>
            ) : (
              <div style={{padding:'40px 0'}}>
                <div style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:40,letterSpacing:'0.04em',color:'rgb(12,106,110)'}}>Thank you!</div>
                <p style={{margin:'18px 0 0',maxWidth:420,fontFamily:"'Manrope', sans-serif",fontSize:16,lineHeight:1.6,color:'rgb(12,106,110)',opacity:0.75}}>We&rsquo;ve received your message and will get back to you shortly to help plan your poolside experience.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
