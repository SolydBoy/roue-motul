import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLots, saveLots, DEFAULT_LOTS } from '../lib/lots'

const ADMIN_PIN = '1234'

export default function AdminPage() {
  const navigate = useNavigate()
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [lots, setLots] = useState(() => getLots())
  const [message, setMessage] = useState(null)

  const total = lots.reduce((sum, l) => sum + Number(l.probability), 0)
  const totalOk = Math.abs(total - 100) < 0.01

  function handlePinSubmit() {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true)
    } else {
      setPinError(true)
      setPin('')
    }
  }

  function updateLot(id, field, value) {
    setLots((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  function removeLot(id) {
    setLots((prev) => prev.filter((l) => l.id !== id))
  }

  function addLot() {
    setLots((prev) => [
      ...prev,
      { id: Date.now().toString(), label: 'Nouveau lot', probability: 10 },
    ])
  }

  function handleSave() {
    if (!totalOk) {
      setMessage({ text: 'Le total doit être égal à 100%', ok: false })
      return
    }
    saveLots(lots)
    setMessage({ text: 'Sauvegardé avec succès !', ok: true })
    setTimeout(() => setMessage(null), 2500)
  }

  function handleReset() {
    if (window.confirm('Remettre les lots par défaut ?')) {
      setLots(DEFAULT_LOTS)
    }
  }

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: '#000' }}
      >
        <h1 className="text-white font-black text-2xl uppercase tracking-wide">
          Admin <span style={{ color: '#E2001A' }}>MOTUL</span>
        </h1>
        <div className="flex flex-col items-center gap-4">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
            placeholder="Code PIN"
            maxLength={8}
            className="text-center text-2xl tracking-widest rounded-lg px-4 py-3 w-44"
            style={{
              background: '#1a1a1a',
              border: `2px solid ${pinError ? '#E2001A' : '#333'}`,
              color: '#fff',
              outline: 'none',
            }}
            autoFocus
          />
          {pinError && (
            <p style={{ color: '#E2001A' }} className="text-sm font-semibold">
              Code incorrect
            </p>
          )}
          <button
            onClick={handlePinSubmit}
            className="font-bold text-white py-3 px-10 rounded-lg"
            style={{ background: '#E2001A', border: 'none' }}
          >
            Accéder
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm mt-4"
          style={{ color: '#555', background: 'none', border: 'none' }}
        >
          ← Retour à la roue
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-black uppercase tracking-wide">
            Admin <span style={{ color: '#E2001A' }}>MOTUL</span>
          </h1>
          <button
            onClick={() => navigate('/')}
            style={{ color: '#666', background: 'none', border: 'none' }}
            className="text-sm"
          >
            ← Retour
          </button>
        </div>

        {/* Lots list */}
        <div className="flex flex-col gap-3 mb-6">
          {lots.map((lot, i) => (
            <div
              key={lot.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: '#1a1a1a' }}
            >
              <span className="text-gray-600 text-sm w-5 shrink-0">{i + 1}</span>
              <input
                value={lot.label}
                onChange={(e) => updateLot(lot.id, 'label', e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-white text-sm"
                style={{ background: '#111', border: '1px solid #2a2a2a', outline: 'none' }}
                placeholder="Nom du lot"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  value={lot.probability}
                  onChange={(e) => updateLot(lot.id, 'probability', parseFloat(e.target.value) || 0)}
                  className="text-center rounded-lg py-2 text-white text-sm w-14"
                  style={{ background: '#111', border: '1px solid #2a2a2a', outline: 'none' }}
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="text-gray-500 text-sm">%</span>
              </div>
              <button
                onClick={() => removeLot(lot.id)}
                style={{ color: '#E2001A', background: 'none', border: 'none', fontSize: 20, lineHeight: 1 }}
                className="shrink-0 w-6"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Total indicator */}
        <div
          className="text-right text-sm font-bold mb-6"
          style={{ color: totalOk ? '#22c55e' : '#E2001A' }}
        >
          Total : {Math.round(total * 10) / 10}%
          {totalOk ? ' ✓' : ' — doit être égal à 100%'}
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={addLot}
            className="text-sm font-semibold py-2 px-4 rounded-lg"
            style={{ background: '#222', color: '#fff', border: 'none' }}
          >
            + Ajouter un lot
          </button>
          <button
            onClick={handleReset}
            className="text-sm py-2 px-4 rounded-lg"
            style={{ background: '#1a1a1a', color: '#666', border: 'none' }}
          >
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={!totalOk}
            className="text-sm font-bold py-2 px-6 rounded-lg ml-auto"
            style={{
              background: totalOk ? '#E2001A' : '#3a1a1a',
              color: totalOk ? '#fff' : '#666',
              border: 'none',
              cursor: totalOk ? 'pointer' : 'not-allowed',
            }}
          >
            Sauvegarder
          </button>
        </div>

        {message && (
          <p
            className="mt-5 text-center font-semibold text-sm"
            style={{ color: message.ok ? '#22c55e' : '#E2001A' }}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}
