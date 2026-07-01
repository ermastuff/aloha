import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { navState } from '../lib/navState.js'

/**
 * Simple, elegant fade between pages.
 *
 * A capture-phase click listener takes over internal route links so we can fade
 * the current page out, swap the route underneath (invisible), then fade the new
 * page in. The whole app shares the teal background, so the brief transparent
 * moment reads as a clean crossfade rather than a flash.
 */

const FADE_OUT = 0.3 // s
const FADE_IN = 0.42 // s

export default function PageTransition({ children }) {
  const navigate = useNavigate()
  const ref = useRef(null)
  const running = useRef(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function run(to) {
      if (running.current) return
      running.current = true
      navState.hasNavigated = true

      const el = ref.current
      if (prefersReduced || !el) {
        navigate(to)
        running.current = false
        return
      }

      el.style.pointerEvents = 'none'
      gsap.to(el, {
        opacity: 0,
        duration: FADE_OUT,
        ease: 'power1.inOut',
        onComplete: () => {
          navigate(to)
          // Let the new page paint at opacity 0, then fade it in.
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              gsap.to(el, {
                opacity: 1,
                duration: FADE_IN,
                ease: 'power1.inOut',
                onComplete: () => {
                  el.style.pointerEvents = ''
                  running.current = false
                },
              })
            }),
          )
        },
      })
    }

    function onClick(e) {
      if (e.defaultPrevented) return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (running.current) return

      const a = e.target.closest && e.target.closest('a')
      if (!a || !a.getAttribute('href')) return
      if (a.target && a.target !== '' && a.target !== '_self') return // new tab
      if (a.hasAttribute('download')) return

      let url
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return // external / tel / mailto
      if (url.pathname === window.location.pathname) return // same page

      e.preventDefault()
      e.stopPropagation()
      run(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])

  return (
    <div ref={ref} className="page-fade">
      {children}
    </div>
  )
}
