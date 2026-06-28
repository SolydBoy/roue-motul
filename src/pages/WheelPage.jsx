import { useState, useCallback, useRef } from 'react'
import Wheel from '../components/Wheel'
import VictoryModal from '../components/VictoryModal'
import { getLots, weightedRandom } from '../lib/lots'

export default function WheelPage() {
  const [lots] = useState(() => getLots())
  const [spinning, setSpinning] = useState(false)
  const [targetIndex, setTargetIndex] = useState(null)
  const [winner, setWinner] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const targetRef = useRef(null)

  const handleSpin = () => {
    if (spinning || showModal || lots.length === 0) return
    const idx = weightedRandom(lots)
    targetRef.current = idx
    setTargetIndex(idx)
    setSpinning(true)
  }

  const handleSpinEnd = useCallback(() => {
    setSpinning(false)
    setWinner(lots[targetRef.current])
    setShowModal(true)
  }, [lots])

  const handleCloseModal = () => {
    setShowModal(false)
    setWinner(null)
    setTargetIndex(null)
  }

  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen px-4 py-8"
      style={{
        background: '#000',
        backgroundImage: 'url(/motul-pattern-grey-carbon.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header */}
      <div className="text-center pt-2 flex flex-col items-center gap-3">
        <img src="/motul-logo.png" alt="Motul" style={{ height: 56, objectFit: 'contain' }} />
        <h1 className="text-white font-black uppercase text-3xl tracking-wide leading-tight">
          Tourne la roue
        </h1>
      </div>

      {/* Wheel */}
      <div className="flex-1 flex items-center justify-center w-full py-4">
        <div style={{ width: '100%', maxWidth: 520, padding: '0 8px' }}>
          <Wheel
            lots={lots}
            spinning={spinning}
            targetIndex={targetIndex}
            onSpinEnd={handleSpinEnd}
          />
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="font-black uppercase text-white text-2xl py-5 px-14 rounded-full transition-all active:scale-95"
        style={{
          background: spinning ? '#555' : '#E2001A',
          boxShadow: spinning ? 'none' : '0 0 30px rgba(226,0,26,0.5)',
          cursor: spinning ? 'not-allowed' : 'pointer',
          border: 'none',
          letterSpacing: '0.05em',
        }}
      >
        Appuie ici
      </button>

      {showModal && winner && (
        <VictoryModal lot={winner} onClose={handleCloseModal} />
      )}
    </div>
  )
}
