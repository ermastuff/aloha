import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Landing from './pages/Landing.jsx'
import About from './pages/About.jsx'
import Treatments from './pages/Treatments.jsx'
import Hotels from './pages/Hotels.jsx'
import Contact from './pages/Contact.jsx'
import PageTransition from './components/PageTransition.jsx'
import FloatingMenu from './components/FloatingMenu.jsx'
import { navState } from './lib/navState.js'

export default function App() {
  const lenisRef = useRef(null)
  const { pathname } = useLocation()

  // ── Smooth scroll (Lenis) wired into the GSAP ticker + ScrollTrigger ──
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
      if (window.__lenis === lenis) window.__lenis = null
    }
  }, [])

  // ── Reset to top on route change (also flags that we've navigated, so the
  //    home preloader only ever plays on the very first load) ──
  const firstRoute = useRef(true)
  useEffect(() => {
    if (firstRoute.current) firstRoute.current = false
    else navState.hasNavigated = true

    const lenis = lenisRef.current
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return (
    <>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PageTransition>
      <FloatingMenu />
    </>
  )
}
