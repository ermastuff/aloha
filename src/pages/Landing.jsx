import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import Preloader from '../components/Preloader.jsx'
import { useCurvedPanel } from '../hooks/useCurvedPanel.js'
import { useIsTouch } from '../hooks/useMediaQuery.js'
import { navState } from '../lib/navState.js'

const EASE = 'cubic-bezier(0.16,1,0.3,1)'

// ─── Lotus SVG paths (from design reference) ────────────────────────────────
const LOTUS_PATHS = [
  "M107.2006,170.6c5.9465,2.0068,32.0209,13.2197,33.6449,16.8733.1422.3199-.1766,1.7397-.5182,1.6633-8.0452-1.801-31.1213-16.3413-69.1306-20.8539l-25.4743-3.0244c-10.2041-1.2115-19.506-.8501-29.8916-.2784.2672,7.1104,1.2451,12.434,2.6261,18.889,6.2009,28.9854,17.0932,56.0193,34.3729,80.3417,1.2196,1.7167,5.4622,1.3509,7.4818,1.1939,15.0867-1.1726,29.2943-.2589,44.4255,1.3554,23.0699,2.4613,44.8162,7.698,65.8817,17.205,22.5176,10.1623,49.052,27.6815,62.5102,49.0746-.6872,1.9068-3.7818,1.8272-5.5534,2.1367-34.0451,5.9482-72.8536,2.8876-105.8975-6.6827-4.9031-1.4201-9.5393-2.6622-14.192-4.8383-8.8571-4.1426-17.6948-7.9991-25.8172-13.3056-16.1935-10.5795-29.4337-23.4783-40.9756-38.9774l-26.4045,3.4766c-.8738.1151-2.4827.8285-3.1828,1.2134-.7025.3862-.3501,3.1975.3354,4.3069,26.7153,43.2391,67.1787,69.8844,118.5163,77.3017,41.8922,6.0526,78.4728,3.7355,113.6019-21.6967l6.2412-4.5184c4.7353-3.4282,6.6088-6.773,7.3521-12.567,3.9149-30.5158,16.3117-58.6265,34.7471-83.2642,24.4304-32.6495,52.2603-51.7591,89.7893-67.2486,4.1384-22.0844,3.8205-43.8061,1.7059-65.7848-.0955-.9925-.9817-2.7556-1.465-3.2058-3.2254-3.0044-35.2356,11.3742-42.108,13.3203,1.8303-6.29,40.154-20.4122,47.5163-21.8529,5.0789,16.1957,8.7652,31.2341,10.0393,47.4857.6102,7.7833.0811,15.4202,1.7002,23.6348,29.1779-7.2033,55.0145-11.4989,85.5454-8.5698-1.0778,39.3183-13.3362,76.3671-34.8096,109.1172l39.363,10.506c1.3625.3637,3.2413,1.1898,3.9354,1.93s.1642,3.3287-.3471,4.3286c-6.0311,11.793-12.7941,22.5548-21.703,32.4601-6.4987,7.2255-12.9888,14.2134-20.4584,20.4979-24.6709,20.7567-54.2074,32.6167-85.8921,37.4249-10.3966,1.5777-35.4894,2.9772-45.2795,2.0861-14.9713-1.3627-29.3139-2.0821-44.4871-6.6468,3.5541-1.8043,7.4151-1.3821,11.2118-.8163,27.7801,4.1395,45.813,3.6232,73.1257-1.6512,38.5515-7.4448,69.0992-24.1909,95.6577-53.1295,1.7407-1.8967,19.7997-24.3139,16.7691-25.3902-7.9859-2.8362-23.5333-6.4278-33.5752-7.1415-11.2328,13.056-24.2514,22.5512-39.1804,30.8581-30.7887,17.1315-80.2121,30.6386-114.2807,32.4738l-20.9619,1.1292c-12.0461,8.2213-23.1821,16.6725-36.9438,21.9892-23.2405,8.9788-47.5166,12.373-72.2755,10.32-18.2273-1.5114-35.3452-3.9013-52.6967-9.5688-27.4868-8.978-51.6863-23.7208-71.0872-45.0358-12.8125-14.0766-23.7313-28.6609-30.7077-47.416,11.779-2.4109,23.1837-3.6729,34.6887-4.9295.6394-.0698,1.9272-1.8779,1.5972-2.3951C15.6234,232.025,4.5311,195.0973,3.4225,155.8787c20.1226-2.5131,49.4373,1.3177,69.3833,4.978,11.9361,2.1904,22.7771,5.8225,34.3948,9.7433ZM433.4515,259.7062c2.7.398,4.6807-1.1582,6.0082-3.5609,15.1218-27.3705,24.7953-56.943,28.0666-88.4668-36.9314-1.5752-75.9533,4.4234-108.5805,19.2179-45.9589,20.8398-77.862,65.0757-80.6071,116.9201,11.7068-8.4619,21.5056-16.7589,33.0949-23.9218,38.0212-23.4996,78.609-26.5871,122.0178-20.1884ZM209.5811,327.2953c1.6937.0513,3.543.051,3.6622-.8121.0952-.6896-.3864-2.6818-1.2385-3.6125-34.9963-38.2258-85.4238-52.5668-137.2909-52.3332-5.1377.0231-10.0814-.6524-15.6459.3629,10.8431,13.3403,23.2624,22.1138,37.4017,30.4121,21.0283,12.3414,44.3418,19.2433,68.5844,22.8605,6.6051.9856,12.9302,2.1644,19.6122,2.3669l24.9148.7553ZM332.5099,327.0822l13.6425-3.0154c10.3606-2.29,20.2219-6.2428,30.163-10.4639,17.9347-7.6152,32.5786-19.7378,45.8435-33.8132,1.3707-1.4545,2.3204-3.4663,2.0041-5.3616-60.298-7.0249-99.1697,11.2719-142.519,50.7547-1.76,1.603-3.6301,2.796-3.6306,4.987,18.7746,1.1293,36.2161.9529,54.4965-3.0876Z",
  "M225.4061,295.686c-20.1446-19.3922-38.0096-39.8616-51.2635-64.0739-15.7669-28.8031-23.9452-59.4085-19.4272-92.0349.5723-4.1331-.1285-5.6939-3.1545-8.1811-15.0372-12.3596-30.5708-23.2856-49.1864-31.5838-5.9765,13.5298-8.0717,27.7221-7.9944,42.3574.0195,3.6852-.3801,6.8986-.9548,10.2313-1.1405-1.4874-2.0566-3.0048-2.1845-4.0454-2.4382-19.829-.2066-38.5515,6.0076-57.4356,4.1886-.0423,7.2107.6743,10.6122,1.9767,17.6627,6.763,34.1406,14.4534,51.2658,24.8871C173.1357,72.0578,205.6437,30.463,242.6931,0c16.3235,12.9123,29.0376,27.8808,41.348,43.9373,15.4335,20.1299,27.2635,41.8921,35.1713,65.9791,4.9827,19.0022,9.9643,38.6588,4.3763,58.7223-3.0483-18.8378-3.5368-35.9521-11.3306-52.3589-13.1533-35.5963-41.0369-70.019-69.3561-95.4552-34.8277,32.9276-66.1212,77.717-72.392,125.0255-7.7201,57.7998,26.8837,114.8132,65.8861,156.6591-4.7058.5909-7.4948-3.4586-10.9901-6.8233Z",
]

const CARDS = [
  { img:'/assets/card-island.jpg',  pos:'center',     title:'INSPIRED BY\nISLAND LIFESTYLE', body:'Bringing wellness to your perfect holiday moment', list:null, btn:null },
  { img:'/assets/hero-massage.png', pos:'center 38%', title:'SIGNATURE\nTREATMENTS',        body:null, list:['Aloha Relax','Deep Waves','Ocean Sports','Island Harmony'], btn:{label:'VIEW FULL MENU',to:'/treatments'} },
  { img:'/assets/card-natural.jpg', pos:'left center', title:'NATURAL\nPROFESSIONAL\nPREMIUM', body:'High-quality products and professional therapists for a unique experience', list:null, btn:null },
  { img:'/assets/card-hotels.jpg',  pos:'center',     title:'FOR HOTELS\n& RESORTS',         body:'Enhance your guests’ experience with our poolside wellness service', list:null, btn:{label:'PARTNER WITH US',to:'/hotels'} },
]

function getTextWidth(el) {
  const r = document.createRange()
  r.selectNodeContents(el)
  return r.getBoundingClientRect().width
}

// The preloader is an intro: it plays only the first time the home is loaded in
// a session. Reloads within the same session and SPA navigation back to home
// both skip it (see navState + sessionStorage below).
const INTRO_KEY = 'aloha_intro_played'
const introPlayed = () => {
  try { return sessionStorage.getItem(INTRO_KEY) === '1' } catch { return false }
}
const markIntroPlayed = () => {
  try { sessionStorage.setItem(INTRO_KEY, '1') } catch (_) {}
}

export default function Landing() {
  const isTouch = useIsTouch()

  // Skip the intro if it already played this session, or if the user reached
  // home by navigating (i.e. this isn't the very first page load).
  const skipIntro = introPlayed() || navState.hasNavigated
  const [started, setStarted] = useState(skipIntro)
  const [showPreloader, setShowPreloader] = useState(!skipIntro)

  // Once home has been seen, never show the intro again this session.
  useEffect(() => { markIntroPlayed() }, [])

  const handlePreloaderDone = () => {
    markIntroPlayed()
    setShowPreloader(false)
    setStarted(true)
  }

  const alohaRef   = useRef(null)
  const luxuryRef  = useRef(null)
  const taglineRef = useRef(null)
  const panelRef   = useRef(null)
  const headingRef = useRef(null)
  const lineLeftRef  = useRef(null)
  const lineRightRef = useRef(null)
  const lotusRef   = useRef(null)
  const headingDoneRef = useRef(false)

  useCurvedPanel(panelRef)

  // ─── Heading scroll reveal + lotus ──────────────────────────────────────
  useEffect(() => {
    function checkExtra() {
      const vh = window.innerHeight || 800

      if (headingRef.current && !headingDoneRef.current) {
        const r = headingRef.current.getBoundingClientRect()
        if (r.top < vh * 0.85 && r.bottom > 0) animateHeading()
      }

      if (lotusRef.current && !lotusRef.current._done) {
        const r = lotusRef.current.getBoundingClientRect()
        if (r.top < vh * 0.78 && r.bottom > 0) animateLotus()
      }
    }

    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = null; checkExtra() })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    checkExtra()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function animateHeading() {
    const el = headingRef.current
    if (!el || headingDoneRef.current) return
    headingDoneRef.current = true
    const lines = Array.from(el.children)
    const totalDur = lines.length * 170 + 1000
    lines.forEach((ln, i) => {
      ln.animate(
        [{ opacity: 0, transform: 'translateY(46px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 1000, delay: i * 170, easing: EASE, fill: 'both' }
      )
    })
    const lineDelay = totalDur + 120
    ;[lineLeftRef.current, lineRightRef.current].forEach((line) => {
      if (!line) return
      line.animate(
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: 900, delay: lineDelay, easing: EASE, fill: 'both' }
      )
    })
  }

  function setupLotus() {
    const svg = lotusRef.current
    if (!svg || svg._setup) return
    svg._setup = true
    const teal = 'rgb(12,106,110)'
    svg._paths = Array.from(svg.querySelectorAll('path'))
    svg._paths.forEach((p) => {
      const len = p.getTotalLength()
      p._len = len
      p.style.fill = teal
      p.style.stroke = teal
      p.style.strokeWidth = '2.2'
      p.style.strokeLinecap = 'round'
      p.style.strokeLinejoin = 'round'
      p.style.vectorEffect = 'non-scaling-stroke'
      p.style.fillOpacity = '0'
      p.style.strokeDasharray = len
      p.style.strokeDashoffset = len
    })
  }

  function animateLotus() {
    const svg = lotusRef.current
    if (!svg || svg._done) return
    setupLotus()
    svg._done = true
    const paths = svg._paths || []
    const stagger = 420, draw = 1100
    paths.forEach((p, i) => {
      const len = p._len
      const delay = 150 + i * stagger
      p.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: draw, delay, easing: 'cubic-bezier(0.33,0,0.18,1)', fill: 'both' }
      )
      p.animate(
        [{ fillOpacity: 0 }, { fillOpacity: 1 }],
        { duration: 750, delay: delay + draw * 0.72, easing: 'ease-out', fill: 'both' }
      )
    })
  }

  // ─── Aloha wordmark ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!started) return            // hero intro waits for the preloader
    const el = alohaRef.current
    if (!el) return

    function layout() {
      const target = el.clientWidth
      const n = (el.textContent || '').trim().length || 1
      const MAX = 320
      // On touch the glyphs only fill part of the width, so the letter-spacing
      // animation can visibly spread the word out to the edges.
      const FILL = isTouch ? 0.72 : 1
      el.style.letterSpacing = '0px'
      el.style.fontSize = MAX + 'px'
      const naturalAtMax = getTextWidth(el)
      if (!naturalAtMax) return null
      const fontSize = Math.min(MAX, (target / naturalAtMax) * MAX * FILL)
      el.style.fontSize = fontSize + 'px'
      const natural = getTextWidth(el)
      const fillLS = n > 1 ? Math.max(0, (target - natural) / (n - 1)) : 0
      return { fontSize, fillLS }
    }

    function runAloha() {
      const L = layout()
      if (!L) return
      el.style.fontSize = L.fontSize + 'px'
      el.style.letterSpacing = '0px'
      el.style.opacity = '1'
      const anim = el.animate(
        [{ letterSpacing: '0px', opacity: 0 }, { letterSpacing: L.fillLS + 'px', opacity: 1 }],
        { duration: 2100, delay: 500, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'both' }
      )
      anim.finished.then(() => {
        try { anim.commitStyles(); anim.cancel() } catch (_) {}
        const L2 = layout()
        if (L2) { el.style.fontSize = L2.fontSize + 'px'; el.style.letterSpacing = L2.fillLS + 'px' }
      })
    }

    function revealLetters(node, startDelay, step) {
      if (!node || node._split) return
      node._split = true
      const text = node.textContent
      node.textContent = ''
      node.style.opacity = '1'
      const spans = []
      for (const ch of text) {
        if (ch === ' ') { node.appendChild(document.createTextNode(' ')); continue }
        const s = document.createElement('span')
        s.textContent = ch
        s.style.display = 'inline-block'
        s.style.opacity = '0'
        node.appendChild(s)
        spans.push(s)
      }
      spans.forEach((s, i) => {
        s.animate(
          [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 460, delay: startDelay + i * step, easing: 'ease-out', fill: 'both' }
        )
      })
    }

    const start = () => {
      runAloha()
      revealLetters(luxuryRef.current, 1500, 26)
      revealLetters(taglineRef.current, 1900, 22)
    }

    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load("320px 'Lancelot'"),
        document.fonts.load("36px 'Manrope'"),
        document.fonts.ready,
      ]).then(start).catch(start)
    } else {
      setTimeout(start, 300)
    }

    const onResize = () => {
      const L = layout()
      if (L) { el.style.fontSize = L.fontSize + 'px'; el.style.letterSpacing = L.fillLS + 'px' }
    }
    window.addEventListener('resize', onResize)
    setupLotus()
    return () => window.removeEventListener('resize', onResize)
  }, [isTouch, started])

  return (
    <div style={{background:'rgb(12,106,110)',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center'}}>

      {showPreloader && <Preloader onComplete={handlePreloaderDone} />}

      {/* ===== HERO ===== */}
      {isTouch ? (
        /* ---------- MOBILE / TABLET HERO ---------- */
        <section className="lh-hero-m">
          <div className="lh-photo-m">
            <video src="/assets/home-2.mp4" autoPlay muted loop playsInline preload="auto"/>
            <div className="lh-grad-m"/>
          </div>
          {started && (
            <>
              <Nav active="home" />
              <div className="lh-mobile">
                <h1 ref={alohaRef} className="lh-aloha-m">Aloha</h1>
                <p ref={luxuryRef} className="lh-lux-m">Luxury massage experiences beside the pool</p>
                <div className="lh-rule-m"/>
                <p ref={taglineRef} className="lh-tag-m">Relax. Reconnect. Recharge.</p>
                <Link to="/treatments" className="book-btn lh-book-m">BOOK YOUR EXPERIENCE</Link>
              </div>
            </>
          )}
        </section>
      ) : (
        /* ---------- DESKTOP HERO ---------- */
        <section style={{position:'relative',width:'100%',height:892,flexShrink:0,overflow:'visible',background:'#14110e',fontFamily:"'Manrope', sans-serif"}}>

          {/* Video background */}
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:-220,zIndex:0,overflow:'hidden'}}>
            <video
              src="/assets/home-2.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 42%',animation:`fade-in 1.8s ease-out 0s 1 both`}}
            />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(20,17,14,0.34) 0%, rgba(20,17,14,0.05) 26%, rgba(20,17,14,0.06) 60%, rgba(20,17,14,0.34) 100%)'}}/>
          </div>

          {started && (
          <div style={{position:'absolute',top:0,bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',zIndex:1}}>
            <Nav active="home" />

            {/* Big "Aloha" wordmark */}
            <h1
              ref={alohaRef}
              style={{position:'absolute',zIndex:3,top:172,left:28,right:28,margin:0,textAlign:'left',color:'rgba(236,226,206,0.9)',fontFamily:"'Lancelot', serif",fontWeight:400,fontSize:'clamp(140px, 26vw, 320px)',lineHeight:1,whiteSpace:'nowrap',opacity:0}}
            >
              Aloha
            </h1>

            {/* Luxury line */}
            <p
              ref={luxuryRef}
              style={{position:'absolute',zIndex:3,left:357,margin:0,width:470,color:'#f2eee6',fontSize:36,fontWeight:400,lineHeight:1.02,letterSpacing:'-0.07em',opacity:0,top:667}}
            >
              Luxury massage experiences beside the pool
            </p>

            {/* Full-width hairline */}
            <div style={{position:'absolute',zIndex:2,left:28,right:28,bottom:124,height:1,transformOrigin:'left center',animation:`wipe-right 1.6s ${EASE} 1.9s both`,backgroundColor:'rgba(238,230,217,0.42)'}}/>

            {/* Decorative fan SVG */}
            <svg viewBox="0 0 300 84" width={288} style={{position:'absolute',zIndex:3,left:30,height:'auto',overflow:'visible',animation:`fade-in 1.6s ease-out 2.1s both`,top:770}}>
              <g fill="none" stroke="#e7dcc6" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round">
                <path d="M4 78 Q90.0 80.0 230.0 78.0"/><path d="M4 78 Q92.4 78.2 233.5 73.6"/>
                <path d="M4 78 Q94.7 76.5 237.1 69.3"/><path d="M4 78 Q97.1 74.7 240.6 64.9"/>
                <path d="M4 78 Q99.4 72.9 244.1 60.6"/><path d="M4 78 Q101.8 71.2 247.6 56.2"/>
                <path d="M4 78 Q104.1 69.4 251.2 51.9"/><path d="M4 78 Q106.5 67.6 254.7 47.5"/>
                <path d="M4 78 Q108.8 65.9 258.2 43.2"/><path d="M4 78 Q111.2 64.1 261.8 38.8"/>
                <path d="M4 78 Q113.5 62.4 265.3 34.5"/><path d="M4 78 Q115.9 60.6 268.8 30.1"/>
                <path d="M4 78 Q118.2 58.8 272.4 25.8"/><path d="M4 78 Q120.6 57.1 275.9 21.4"/>
                <path d="M4 78 Q122.9 55.3 279.4 17.1"/><path d="M4 78 Q125.3 53.5 282.9 12.7"/>
                <path d="M4 78 Q127.6 51.8 286.5 8.4"/> <path d="M4 78 Q130.0 50.0 290.0 4.0"/>
              </g>
            </svg>

            {/* Vertical line above fan */}
            <svg width="8" height="82" viewBox="0 0 8 82" style={{position:'absolute',left:332.5,top:768,width:8,height:82,overflow:'visible',fill:'none',stroke:'#eee6d9',strokeWidth:1,strokeLinecap:'round',transformOrigin:'top center',animation:`grow-down 1s ${EASE} 1.85s both`}}>
              <path d="M 4.5 82 L 3.5 0"/>
            </svg>

            {/* Relax tagline */}
            <p
              ref={taglineRef}
              style={{position:'absolute',zIndex:3,left:356,bottom:70,margin:0,color:'#f2eee6',fontSize:16,fontWeight:400,letterSpacing:'-0.07em',opacity:0}}
            >
              Relax. Reconnect. Recharge.
            </p>

            {/* Book button */}
            <Link
              to="/treatments"
              className="book-btn"
              style={{position:'absolute',zIndex:3,right:28,bottom:53,display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'16px 32px',borderRadius:40,border:'1px solid rgba(240,233,221,0.28)',color:'#f4efe8',textDecoration:'none',fontSize:16,fontWeight:700,letterSpacing:'0.04em',whiteSpace:'nowrap',backdropFilter:'blur(2px)',background:'transparent',transition:`background 0.5s ${EASE}, color 0.5s ease, border-color 0.5s ease`,animation:`rise-in 1.1s ${EASE} 2.1s both`}}
            >
              BOOK YOUR EXPERIENCE
            </Link>
          </div>
          )}
        </section>
      )}

      {/* ===== SECTION 2 — WHERE RELAXATION MEETS PARADISE ===== */}
      <section ref={panelRef} className="landing-panel">
        <div className="lp-inner">

          {/* Centered heading */}
          <div ref={headingRef} className="lp-heading">
            <span style={{display:'block',opacity:0,willChange:'transform, opacity'}}>WHERE</span>
            <span style={{display:'block',opacity:0,willChange:'transform, opacity'}}>RELAXATION</span>
            <span style={{display:'block',opacity:0,willChange:'transform, opacity'}}>MEETS PARADISE</span>
          </div>

          {/* Lotus / hairline divider */}
          <div className="lp-divider">
            <div ref={lineLeftRef} className="lp-divline"/>
            <svg ref={lotusRef} className="lp-lotus" viewBox="0 0 493.4445 374.3283">
              {LOTUS_PATHS.map((d, i) => <path key={i} d={d}/>)}
            </svg>
            <div ref={lineRightRef} className="lp-divline"/>
          </div>

          {/* Treatment teaser cards */}
          <div className="lp-cards">
            {CARDS.map(({ img, pos, title, body, list, btn }, idx) => (
              <div key={idx} className="reveal-up lp-card" style={{transitionDelay:`${idx*0.12}s`}}>
                <img src={img} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:pos}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(8,40,42,0.34) 0%, rgba(8,40,42,0.06) 38%, rgba(6,28,30,0.82) 100%)'}}/>
                <div className="t-card" style={{position:'absolute',inset:0,color:'#fff'}}>
                  <span className="t-title">{title.split('\n').map((l,i)=><span key={i}>{l}{i<title.split('\n').length-1&&<br/>}</span>)}</span>
                  <div className="card-body">
                    {body && <p style={{margin:0,fontFamily:"'Manrope', sans-serif",fontSize:16,lineHeight:1.6,color:'#fff',opacity:0.92}}>{body}</p>}
                    {list && <div style={{display:'flex',flexDirection:'column',gap:5,fontFamily:"'Manrope', sans-serif",fontSize:16,lineHeight:1.55}}>{list.map(t=><span key={t}>{t}</span>)}</div>}
                    {btn && <Link to={btn.to} className="pill-btn-light" style={{marginTop:20}}>{btn.label}</Link>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature icons row */}
          <div className="lp-features">
            <div className="reveal-up lp-feat">
              <div className="lp-feat-ico">
                <svg viewBox="0 0 70 56" className="feat-icon" style={{width:62,height:'auto'}}>
                  <path d="M6 16 q 9 -10 18 0 t 18 0 t 18 0"/>
                  <path d="M6 30 q 9 -10 18 0 t 18 0 t 18 0"/>
                  <path d="M6 44 q 9 -10 18 0 t 18 0 t 18 0"/>
                </svg>
              </div>
              <span className="lp-feat-label">POOLSIDE<br/>TREATMENTS</span>
            </div>
            <div className="lp-feat-div"/>
            <div className="reveal-up lp-feat" style={{transitionDelay:'0.12s'}}>
              <div className="lp-feat-ico">
                <svg viewBox="0 0 493.4445 374.3283" style={{width:72,height:'auto',fill:'rgb(12,106,110)'}}>
                  {LOTUS_PATHS.map((d,i)=><path key={i} d={d}/>)}
                </svg>
              </div>
              <span className="lp-feat-label">RELAX &amp;<br/>RECHARGE</span>
            </div>
            <div className="lp-feat-div"/>
            <div className="reveal-up lp-feat" style={{transitionDelay:'0.24s'}}>
              <div className="lp-feat-ico">
                <svg viewBox="0 0 80 80" className="feat-icon" style={{width:58,height:'auto'}}>
                  <circle cx="40" cy="40" r="15"/>
                  <line x1="40" y1="18" x2="40" y2="9"/><line x1="40" y1="62" x2="40" y2="71"/>
                  <line x1="62" y1="40" x2="71" y2="40"/><line x1="18" y1="40" x2="9" y2="40"/>
                  <line x1="55.6" y1="24.4" x2="61.9" y2="18.1"/><line x1="24.4" y1="24.4" x2="18.1" y2="18.1"/>
                  <line x1="55.6" y1="55.6" x2="61.9" y2="61.9"/><line x1="24.4" y1="55.6" x2="18.1" y2="61.9"/>
                </svg>
              </div>
              <span className="lp-feat-label">TROPICAL<br/>ATMOSPHERE</span>
            </div>
            <div className="lp-feat-div"/>
            <div className="reveal-up lp-feat" style={{transitionDelay:'0.36s'}}>
              <div className="lp-feat-ico">
                <svg viewBox="0 0 64 84" className="feat-icon" style={{width:52,height:'auto'}}>
                  <path d="M32 5 C18.7 5 8 15.7 8 29 C8 47 32 70 32 70 C32 70 56 47 56 29 C56 15.7 45.3 5 32 5 Z"/>
                  <circle cx="32" cy="29" r="11"/>
                  <ellipse cx="32" cy="78" rx="15" ry="4.5"/>
                </svg>
              </div>
              <span className="lp-feat-label">GRAN<br/>CANARIA</span>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
