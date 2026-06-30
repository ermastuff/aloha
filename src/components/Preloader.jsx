import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Home preloader.
 * Cream screen with a centered logo; the hero video rises from the bottom as a
 * dome that smoothly grows to full-page, then the overlay fades to hand off to
 * the live hero. Eased in and out for a controlled, elegant reveal.
 */
export default function Preloader({ onComplete }) {
  const rootRef  = useRef(null)
  const domeRef  = useRef(null)
  const videoRef = useRef(null)
  const logoRef  = useRef(null)
  const fillRef  = useRef(null)

  useEffect(() => {
    const root  = rootRef.current
    const dome  = domeRef.current
    const logo  = logoRef.current
    const video = videoRef.current
    if (!root || !dome || !logo) return

    // Lock scrolling while the preloader plays
    window.__lenis?.stop()
    document.documentElement.classList.add('pl-lock')
    window.scrollTo(0, 0)

    // Dome geometry driven through a proxy so height + radius ease together.
    // Starts at zero height so the cream + logo show alone first.
    const st = { h: 0, r: 1 }
    const apply = () => {
      dome.style.height = st.h + 'vh'
      const rad = `${50 * st.r}% ${92 * st.r}px`
      dome.style.borderTopLeftRadius  = rad
      dome.style.borderTopRightRadius = rad
    }
    apply()

    // Brown fill of the logo, revealed top → bottom (via clip-path on a
    // brown layer masked to the logo silhouette)
    const fill = fillRef.current
    const fp = { p: 0 }
    const applyFill = () => { if (fill) fill.style.clipPath = `inset(0 0 ${100 - fp.p}% 0)` }
    applyFill()

    const finish = () => {
      window.__lenis?.start()
      document.documentElement.classList.remove('pl-lock')
      onComplete?.()
    }

    // Respect reduced-motion: skip straight to the page
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return () => {}
    }

    const timers = []

    // 1) The logo fills with brown from top to bottom while the video loads
    gsap.to(fp, { p: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: applyFill, delay: 0.2 })

    // 2) After the fill has finished AND the video can play, the dome rises
    //    from the bottom. The logo sits beneath the video, so it is simply
    //    covered by the rising water (no fade), then the overlay fades out to
    //    hand off to the live hero.
    const mount = performance.now()
    let started = false
    const startDome = () => {
      if (started) return
      started = true
      const tl = gsap.timeline({ onComplete: finish })
      tl.to(st,   { h: 100, r: 0, duration: 2.0, ease: 'power2.inOut', onUpdate: apply }, 0)
        .to(root, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 2.05)
    }
    // Let the brown fill finish (~1.8s from mount) before the video rises
    const scheduleDome = () => {
      const elapsed = performance.now() - mount
      timers.push(setTimeout(startDome, Math.max(0, 1800 - elapsed)))
    }

    if (video && video.readyState >= 3) scheduleDome()
    else if (video) video.addEventListener('canplay', scheduleDome, { once: true })
    else scheduleDome()
    timers.push(setTimeout(startDome, 2800)) // hard fallback

    return () => {
      timers.forEach(clearTimeout)
      window.__lenis?.start()
      document.documentElement.classList.remove('pl-lock')
    }
  }, [onComplete])

  return (
    <div ref={rootRef} className="preloader">
      <div ref={logoRef} className="pl-logo">
        <img className="pl-logo-sizer" src="/assets/logo.png" alt="Aloha Massage Poolside Wellness" />
        <span className="pl-logo-ghost" aria-hidden="true" />
        <span ref={fillRef} className="pl-logo-fill" aria-hidden="true" />
      </div>
      <div ref={domeRef} className="pl-dome">
        <video ref={videoRef} src="/assets/home-2.mp4" autoPlay muted loop playsInline preload="auto" />
        <div className="pl-dome-grad" />
      </div>
    </div>
  )
}
