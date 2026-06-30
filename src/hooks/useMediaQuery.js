import { useState, useEffect } from 'react'

// Breakpoints: mobile ≤640 · tablet 641–1024 · desktop >1024
export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(get)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 640px)')
export const useIsTablet = () => useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
// True on phones + tablets — used to swap pinned sliders for swipe carousels.
export const useIsTouch  = () => useMediaQuery('(max-width: 1024px)')
