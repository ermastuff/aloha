import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <section className="site-footer" style={{width:'100%',flexShrink:0,background:'rgb(12,106,110)',color:'rgb(197,190,177)',fontFamily:"'Manrope', sans-serif",display:'flex',flexDirection:'column',alignItems:'center',padding:'92px 0 46px',boxSizing:'border-box'}}>
      <div style={{width:1360,maxWidth:'calc(100% - 120px)'}}>

        <div className="reveal-up" style={{display:'flex',justifyContent:'center'}}>
          <Link to="/">
            <img src="/assets/logo.png" alt="Aloha Massage Poolside Wellness" style={{height:'clamp(112px, 26vw, 150px)',width:'auto',filter:'brightness(1.45) saturate(0.55)'}}/>
          </Link>
        </div>

        <div className="reveal-up footer-actions" style={{transitionDelay:'0.1s',display:'flex',gap:40,marginTop:48}}>
          <a href="https://wa.me/" className="footer-btn">
            <span style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(38px, 9vw, 64px)',letterSpacing:'0.06em',lineHeight:1}}>WHATSAPP</span>
            <span style={{fontSize:'clamp(14px, 3.6vw, 16px)',opacity:0.8}}>We&rsquo;re available every day</span>
          </a>
          <a href="tel:0376000000" className="footer-btn">
            <span style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(38px, 9vw, 64px)',letterSpacing:'0.06em',lineHeight:1}}>CALL US</span>
            <span style={{fontSize:'clamp(14px, 3.6vw, 16px)',opacity:0.8}}>We&rsquo;re available from 10am &ndash; 8pm</span>
          </a>
        </div>

        <div className="reveal-up footer-info" style={{transitionDelay:'0.16s',marginTop:64,borderTop:'1px solid rgba(197,190,177,0.4)',display:'flex',justifyContent:'space-between',padding:'24px 2px 0',fontSize:16,letterSpacing:'-0.02em'}}>
          <span>MONDAY TO SUNDAY 10AM&ndash;8PM</span>
          <span>TEL: 0376000000</span>
          <span>TAZIO NUVOLARI STREET</span>
        </div>

        <div className="reveal-up" style={{transitionDelay:'0.1s',marginTop:84,display:'flex',flexDirection:'column',alignItems:'center'}}>
          <p style={{margin:0,fontSize:16,opacity:0.85,textAlign:'center'}}>What&rsquo;s happening behind the scenes at Aloha</p>
          <div className="footer-ig" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:22,marginTop:20}}>
            <svg viewBox="0 0 48 48" style={{width:'clamp(34px, 8vw, 44px)',height:'clamp(34px, 8vw, 44px)',flexShrink:0,fill:'none',stroke:'rgb(197,190,177)',strokeWidth:2.4}}>
              <rect x="6" y="6" width="36" height="36" rx="11"/>
              <circle cx="24" cy="24" r="9"/>
              <circle cx="35" cy="13" r="2" fill="rgb(197,190,177)" stroke="none"/>
            </svg>
            <span className="ig-handle" style={{fontFamily:"'Fraunces', serif",fontWeight:300,fontSize:'clamp(22px, 6vw, 54px)',letterSpacing:'0.04em',lineHeight:1,wordBreak:'break-word'}}>
              alohamassage_poolsodewellness
            </span>
          </div>
        </div>

        <p style={{margin:'72px 0 0',textAlign:'center',fontSize:13,letterSpacing:'0.06em',opacity:0.65}}>
          ALOHA MASSAGE POOLSIDE WELLNESS | ALL RIGHTS RESERVED 2026
        </p>
      </div>
    </section>
  )
}
