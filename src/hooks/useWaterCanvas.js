import { useEffect } from 'react'

export function useWaterCanvas(heroRef, canvasRef) {
  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return

    const s = { cols: 230, damping: 0.978, idleT: 0, frame: 0 }

    // Desktop-only pointer interaction (a hand gliding across the water)
    const pointer = { active: false, x: 0, y: 0, lx: 0, ly: 0 }
    const desktopMQ = window.matchMedia('(min-width: 1025px)')
    let interactive = desktopMQ.matches

    function resizeWater() {
      const r = hero.getBoundingClientRect()
      const aspect = r.height / Math.max(1, r.width)
      s.W = s.cols
      s.H = Math.max(2, Math.round(s.cols * aspect))
      canvas.width = s.W
      canvas.height = s.H
      const n = s.W * s.H
      s.buf1 = new Float32Array(n)
      s.buf2 = new Float32Array(n)
      s.ctx = canvas.getContext('2d')
      s.img = s.ctx.createImageData(s.W, s.H)
    }

    function disturb(cx, cy, strength, rad = 3) {
      const { W, H, buf1: b } = s
      for (let yy = -rad; yy <= rad; yy++) {
        for (let xx = -rad; xx <= rad; xx++) {
          const x = cx + xx, y = cy + yy
          if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) continue
          const d = Math.sqrt(xx * xx + yy * yy)
          if (d > rad + 0.5) continue
          b[y * W + x] += strength * (1 - d / (rad + 1))
        }
      }
    }

    function waterStep() {
      const { W, H, buf1: b1, buf2: b2, damping: damp } = s
      for (let y = 1; y < H - 1; y++) {
        let i = y * W + 1
        for (let x = 1; x < W - 1; x++, i++) {
          b2[i] = ((b1[i - 1] + b1[i + 1] + b1[i - W] + b1[i + W]) * 0.5 - b2[i]) * damp
        }
      }
      s.buf1 = b2; s.buf2 = b1
    }

    function waterRender() {
      const { W, H, buf1: b, img: imgData, ctx } = s
      const d = imgData.data
      const cl = (v) => v < 0 ? 0 : v > 255 ? 255 : v
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = y * W + x
          const xl = x > 0 ? b[i - 1] : b[i]
          const xr = x < W - 1 ? b[i + 1] : b[i]
          const yu = y > 0 ? b[i - W] : b[i]
          const yd = y < H - 1 ? b[i + W] : b[i]
          let l = ((xl - xr) + (yu - yd)) * 0.42
          if (l > 44) l = 44; if (l < -34) l = -34
          const p = i * 4
          d[p]     = cl(12  + l * 0.7)
          d[p + 1] = cl(106 + l * 1.0)
          d[p + 2] = cl(110 + l * 1.05)
          d[p + 3] = 255
        }
      }
      ctx.putImageData(imgData, 0, 0)
    }

    let raf
    function tick() {
      s.idleT++
      // Ambient ripples — calmer while the user is actively interacting
      const idleChance = interactive && pointer.active ? 0.012 : 0.03
      if (s.idleT > 30 && Math.random() < idleChance) {
        disturb(
          2 + Math.floor(Math.random() * (s.W - 4)),
          2 + Math.floor(Math.random() * (s.H - 4)),
          30
        )
      }

      // Pointer wake — disturb every cell along the path travelled this frame
      if (interactive && pointer.active) {
        const dx = pointer.x - pointer.lx
        const dy = pointer.y - pointer.ly
        const dist = Math.hypot(dx, dy)
        if (dist > 0.0001) {
          const steps = Math.min(22, Math.max(1, Math.ceil(dist)))
          const strength = Math.min(13, 4.5 + dist * 0.7) // gentle, speed-aware
          for (let k = 1; k <= steps; k++) {
            const t = k / steps
            disturb(Math.round(pointer.lx + dx * t), Math.round(pointer.ly + dy * t), strength, 4)
          }
        }
        pointer.lx = pointer.x
        pointer.ly = pointer.y
      }

      s.frame++
      if (s.frame % 2 === 0) waterStep()
      waterRender()
      raf = requestAnimationFrame(tick)
    }

    function onPointerMove(e) {
      if (!interactive) return
      const r = hero.getBoundingClientRect()
      const gx = (e.clientX - r.left) / Math.max(1, r.width)  * s.W
      const gy = (e.clientY - r.top)  / Math.max(1, r.height) * s.H
      pointer.x = gx
      pointer.y = gy
      if (!pointer.active) { pointer.lx = gx; pointer.ly = gy } // no jump on entry
      pointer.active = true
    }
    function onPointerLeave() { pointer.active = false }
    function onMQChange() {
      interactive = desktopMQ.matches
      if (!interactive) pointer.active = false
    }

    resizeWater()
    const onResize = () => resizeWater()
    window.addEventListener('resize', onResize)
    hero.addEventListener('mousemove', onPointerMove)
    hero.addEventListener('mouseleave', onPointerLeave)
    desktopMQ.addEventListener('change', onMQChange)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      hero.removeEventListener('mousemove', onPointerMove)
      hero.removeEventListener('mouseleave', onPointerLeave)
      desktopMQ.removeEventListener('change', onMQChange)
    }
  }, [])
}
