import { useEffect } from 'react'

export function useCurvedPanel(panelRef) {
  useEffect(() => {
    const el = panelRef.current
    if (!el) return

    function checkReveals() {
      const vh = window.innerHeight || 800
      document.querySelectorAll('.reveal-up:not(.in)').forEach((node) => {
        const r = node.getBoundingClientRect()
        if (r.top < vh * 0.86 && r.bottom > 0) node.classList.add('in')
      })
    }

    function updateCurve() {
      checkReveals()
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 800
      let p = 1 - (rect.top / vh)
      p = Math.max(0, Math.min(1, p))
      const H = 165 - p * 110
      el.style.borderTopLeftRadius  = `50% ${H}px`
      el.style.borderTopRightRadius = `50% ${H}px`
    }

    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = null; updateCurve() })
    }

    updateCurve()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateCurve)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateCurve)
    }
  }, [])
}
