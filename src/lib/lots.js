const STORAGE_KEY = 'motul_lots'

export const DEFAULT_LOTS = [
  { id: '1', label: 'Casquette Motul', probability: 10 },
  { id: '2', label: 'T-shirt Motul', probability: 10 },
  { id: '3', label: 'Stickers Pack', probability: 10 },
  { id: '4', label: 'Huile Motul 300V', probability: 10 },
  { id: '5', label: 'Bidon 1L Motul', probability: 10 },
  { id: '6', label: 'Porte-clés', probability: 10 },
  { id: '7', label: 'Tote Bag', probability: 10 },
  { id: '8', label: 'Gants méca', probability: 10 },
  { id: '9', label: 'Lot découverte', probability: 10 },
  { id: '10', label: 'Bon cadeau 50€', probability: 10 },
]

export function getLots() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_LOTS
}

export function saveLots(lots) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lots))
}

export function weightedRandom(lots) {
  const total = lots.reduce((sum, l) => sum + l.probability, 0)
  let r = Math.random() * total
  for (let i = 0; i < lots.length; i++) {
    r -= lots[i].probability
    if (r <= 0) return i
  }
  return lots.length - 1
}
