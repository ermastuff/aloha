import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const EASE = 'cubic-bezier(0.16,1,0.3,1)'

const LINKS = [
  { to: '/treatments', label: 'Treatments', key: 'treatments' },
  { to: '/about',      label: 'About Us',   key: 'about' },
  { to: '/hotels',     label: 'For Hotels', key: 'hotels' },
  { to: '/contact',    label: 'Contact Us', key: 'contact' },
]

export default function Nav({ active }) {
  const [open, setOpen] = useState(false)

  // Lock smooth scroll while the overlay menu is open
  useEffect(() => {
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
    return () => window.__lenis?.start()
  }, [open])

  return (
    <>
      {/* ===== DESKTOP NAV ===== */}
      <div className="nav-desktop">
        {/* Top hairlines — left segment */}
        <div style={{position:'absolute',zIndex:2,top:30,left:28,right:'calc(50% + 86px)',height:1,background:'rgba(238,230,217,0.42)',transformOrigin:'left center',animation:`wipe-right 1.3s ${EASE} 0.5s both`}}/>
        <div style={{position:'absolute',zIndex:2,top:84,left:28,right:'calc(50% + 86px)',height:1,background:'rgba(238,230,217,0.42)',transformOrigin:'left center',animation:`wipe-right 1.3s ${EASE} 0.6s both`}}/>
        {/* Top hairlines — right segment */}
        <div style={{position:'absolute',zIndex:2,top:30,right:28,left:'calc(50% + 86px)',height:1,background:'rgba(238,230,217,0.42)',transformOrigin:'left center',animation:`wipe-right 1.3s ${EASE} 0.55s both`}}/>
        <div style={{position:'absolute',zIndex:2,top:84,right:28,left:'calc(50% + 86px)',height:1,background:'rgba(238,230,217,0.42)',transformOrigin:'left center',animation:`wipe-right 1.3s ${EASE} 0.65s both`}}/>

        {/* Left menu group */}
        <div style={{position:'absolute',zIndex:3,top:30,height:54,left:28,right:'calc(50% + 86px)',display:'flex',animation:`drop-in 1s ${EASE} 0.9s both`}}>
          <Link to="/treatments" className={`menu-item${active==='treatments'?' active':''}`}>
            <span className="mi-dot"/><span>Treatments</span>
          </Link>
          <span className="vline" style={{animation:`grow-down 0.9s ${EASE} 0.7s both`}}/>
          <Link to="/about" className={`menu-item${active==='about'?' active':''}`}>
            <span className="mi-dot"/><span>About Us</span>
          </Link>
          <span className="vline" style={{animation:`grow-down 0.9s ${EASE} 0.78s both`}}/>
          <span className="menu-spacer"/>
        </div>

        {/* Right menu group */}
        <div style={{position:'absolute',zIndex:3,top:30,height:54,right:28,left:'calc(50% + 86px)',display:'flex',animation:`drop-in 1s ${EASE} 0.9s both`}}>
          <span className="menu-spacer"/>
          <span className="vline" style={{animation:`grow-down 0.9s ${EASE} 0.78s both`}}/>
          <Link to="/hotels" className={`menu-item${active==='hotels'?' active':''}`}>
            <span className="mi-dot"/><span>For Hotels</span>
          </Link>
          <span className="vline" style={{animation:`grow-down 0.9s ${EASE} 0.7s both`}}/>
          <Link to="/contact" className={`menu-item${active==='contact'?' active':''}`}>
            <span className="mi-dot"/><span>Contact Us</span>
          </Link>
        </div>

        {/* Centered logo */}
        <Link to="/" style={{position:'absolute',zIndex:4,top:12,left:'50%',transform:'translateX(-50%)',display:'block'}}>
          <img
            src="/assets/logo.png"
            alt="Aloha Massage Poolside Wellness"
            style={{height:146,width:'auto',filter:'brightness(1.32) saturate(0.62)',display:'block',animation:`fade-in 1.3s ease-out 0.3s both`}}
          />
        </Link>
      </div>

      {/* ===== MOBILE / TABLET BAR ===== */}
      <div className="nav-mobile">
        <Link to="/" className="nav-mobile-logo">
          <img src="/assets/logo.png" alt="Aloha Massage Poolside Wellness"/>
        </Link>
        <button className="nav-burger" aria-label="Open menu" onClick={() => setOpen(true)}>
          <span/><span/><span/>
        </button>
      </div>

      {/* ===== MOBILE OVERLAY MENU ===== */}
      <div className={`nav-overlay${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        <button className="nav-overlay-close" aria-label="Close menu" onClick={() => setOpen(false)}>
          <span/><span/>
        </button>
        <nav className="nav-overlay-links">
          {LINKS.map((l, i) => (
            <Link
              key={l.key}
              to={l.to}
              onClick={() => setOpen(false)}
              className={active === l.key ? 'active' : ''}
              style={{ transitionDelay: open ? `${0.12 + i * 0.06}s` : '0s' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
