import { useRef, useEffect, useCallback } from 'react'

const COLORS = ['#E2001A', '#1C1C1C', '#FFFFFF', '#888888']
const TEXT_COLORS = ['#FFFFFF', '#FFFFFF', '#1C1C1C', '#FFFFFF']
const TWO_PI = Math.PI * 2

function easeOut(t) {
  return 1 - Math.pow(1 - t, 4)
}

export default function Wheel({ lots, spinning, targetIndex, onSpinEnd }) {
  const canvasRef = useRef(null)
  const rotationRef = useRef(0)
  const animRef = useRef(null)
  const n = lots.length
  const segAngle = TWO_PI / n

  const draw = useCallback((rotation) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = canvas.width
    const cx = size / 2
    const cy = size / 2
    const radius = cx - 6

    ctx.clearRect(0, 0, size, size)

    // Outer ring shadow
    ctx.save()
    ctx.shadowColor = '#E2001A'
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 4, 0, TWO_PI)
    ctx.strokeStyle = '#E2001A'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.restore()

    lots.forEach((lot, i) => {
      const start = rotation + i * segAngle - Math.PI / 2
      const end = start + segAngle

      // Segment fill
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, start, end)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % 4]
      ctx.fill()
      ctx.strokeStyle = '#111'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Label
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + segAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = TEXT_COLORS[i % 4]
      const fontSize = Math.max(11, Math.min(15, (size / n) * 0.45))
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.8)'
      ctx.shadowBlur = 4
      // Truncate long labels
      let label = lot.label
      if (ctx.measureText(label).width > radius * 0.72) {
        while (ctx.measureText(label + '…').width > radius * 0.72 && label.length > 1) {
          label = label.slice(0, -1)
        }
        label += '…'
      }
      ctx.fillText(label, radius - 14, fontSize / 3)
      ctx.restore()
    })

    // Center hub
    ctx.beginPath()
    ctx.arc(cx, cy, 26, 0, TWO_PI)
    ctx.fillStyle = '#000'
    ctx.fill()
    ctx.strokeStyle = '#E2001A'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = '#E2001A'
    ctx.font = 'bold 14px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('M', cx, cy)
    ctx.textBaseline = 'alphabetic'
  }, [lots, segAngle, n])

  useEffect(() => {
    draw(rotationRef.current)
  }, [draw])

  useEffect(() => {
    if (!spinning || targetIndex === null) return

    cancelAnimationFrame(animRef.current)

    const targetRot = -(targetIndex + 0.5) * segAngle
    const currentNorm = ((rotationRef.current % TWO_PI) + TWO_PI) % TWO_PI
    const targetNorm = ((targetRot % TWO_PI) + TWO_PI) % TWO_PI
    let delta = targetNorm - currentNorm
    if (delta <= 0) delta += TWO_PI

    const spins = 6 + Math.floor(Math.random() * 3)
    const totalRotation = spins * TWO_PI + delta
    const startRotation = rotationRef.current
    const endRotation = startRotation + totalRotation
    const duration = 4500
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = startRotation + totalRotation * easeOut(progress)
      rotationRef.current = current
      draw(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        rotationRef.current = endRotation
        setTimeout(onSpinEnd, 400)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [spinning, targetIndex])

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer triangle at top */}
      <div
        className="absolute z-10"
        style={{
          top: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '28px solid #E2001A',
          filter: 'drop-shadow(0 2px 6px rgba(226,0,26,0.8))',
        }}
      />
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ width: '100%', maxWidth: 500, height: 'auto', display: 'block' }}
      />
    </div>
  )
}
