import { useEffect, useState } from 'react'

const CONFETTI_COLORS = ['#E2001A', '#ffffff', '#ff6b6b', '#ffcc00', '#ff4444']

function generateConfetti() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    width: 8 + Math.random() * 10,
    height: 8 + Math.random() * 10,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 0.8,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }))
}

export default function VictoryModal({ lot, onClose }) {
  const [confetti] = useState(generateConfetti)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center fade-in"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            top: 0,
            width: c.width,
            height: c.height,
            background: c.color,
            borderRadius: c.borderRadius,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {/* Card */}
      <div
        className="victory-pop flex flex-col items-center gap-6 px-10 py-12 mx-6 rounded-2xl text-center"
        style={{
          background: '#111',
          border: '2px solid #E2001A',
          boxShadow: '0 0 60px rgba(226,0,26,0.4)',
          maxWidth: 480,
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-400 text-lg font-semibold uppercase tracking-widest">
          Félicitations !
        </p>

        <div
          className="text-white font-black text-4xl leading-tight"
          style={{ textShadow: '0 0 30px rgba(226,0,26,0.6)' }}
        >
          {lot.label}
        </div>

        <div
          className="w-16 h-1 rounded-full"
          style={{ background: '#E2001A' }}
        />

        <p className="text-gray-500 text-sm">
          Appuie pour continuer
        </p>
      </div>

      {/* Tap anywhere overlay hint */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
}
