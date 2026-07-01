import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Floating right-edge menu that appears once the hero has scrolled away (i.e.
// the second section fills the screen). The MENU pill opens a small panel with
// the site links; the round button below toggles a looping ambient track
// (starts on first click to respect browser autoplay policies).

const AMBIENT_SRC = '/assets/rockot-spa-ambient-10min-253179.mp3'
const AMBIENT_VOLUME = 0.45

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/treatments', label: 'Treatments' },
  { to: '/about', label: 'About Us' },
  { to: '/hotels', label: 'For Hotels' },
  { to: '/contact', label: 'Contact Us' },
]

export default function FloatingMenu() {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(true)
  const audioRef = useRef(null)
  const { pathname } = useLocation()

  // Ambient audio: play/pause on toggle. Starts muted (paused) so nothing plays
  // until the user opts in via the button — no blocked autoplay.
  const toggleAudio = () => {
    const a = audioRef.current
    if (!a) return
    if (muted) {
      a.volume = AMBIENT_VOLUME
      a.muted = false
      const p = a.play()
      if (p && p.catch) p.catch(() => {})
      setMuted(false)
    } else {
      a.pause()
      setMuted(true)
    }
  }

  // Reveal after scrolling past the hero.
  useEffect(() => {
    let raf = null
    const update = () => {
      raf = null
      const vh = window.innerHeight || 800
      setShow((window.scrollY || window.pageYOffset || 0) > vh * 0.8)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Each new page starts at its hero → reset visibility + close the panel.
  useEffect(() => {
    setOpen(false)
    setShow(false)
  }, [pathname])

  // Never leave the panel open while the toggle is hidden.
  useEffect(() => {
    if (!show) setOpen(false)
  }, [show])

  const active = show ? 0 : -1

  return (
    <div className={`fmenu${show ? ' show' : ''}${open ? ' open' : ''}`} aria-hidden={!show}>
      <div className="fmenu-main">
        <nav className="fmenu-panel" aria-label="Site sections">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={pathname === l.to ? 'active' : ''}
              onClick={() => setOpen(false)}
              tabIndex={show && open ? 0 : -1}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="fmenu-side">
          <button
            type="button"
            className="fmenu-pill"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            tabIndex={active}
          >
            <span className="fmenu-burger" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="fmenu-label">MENU</span>
          </button>

          <button
            type="button"
            className={`fmenu-audio${muted ? ' muted' : ''}`}
            aria-label={muted ? 'Play ambient sound' : 'Pause ambient sound'}
            aria-pressed={!muted}
            onClick={toggleAudio}
            tabIndex={active}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path className="fmenu-spk" d="M3 9 H5.5 L9.5 5.5 V18.5 L5.5 15 H3 Z" />
              {muted ? (
                <path className="fmenu-wave" d="M13.5 9.5 L18.5 14.5 M18.5 9.5 L13.5 14.5" />
              ) : (
                <path className="fmenu-wave" d="M13 9 a4 4 0 0 1 0 6 M15.5 7 a7 7 0 0 1 0 10" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={AMBIENT_SRC} loop preload="none" />
    </div>
  )
}
