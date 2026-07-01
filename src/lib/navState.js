// Shared flag: becomes true after the first in-app navigation. The home
// preloader is an intro, so it should appear only on the very first page load
// (and only when that page is the home) — never when navigating back to home
// within the same session.
export const navState = { hasNavigated: false }
