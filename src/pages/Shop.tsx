import { useState, useMemo, useEffect } from 'react'
import type { FormEvent } from 'react'
import type { OrderMode } from '../data'
import { deliveryZones, orderModes } from '../data'

// ── Product catalogue ───────────────────────────────────────────────────────
// errand: true = we source/buy this for the customer (no fixed stock)
const products = [
  // ── Grains & Cereals ──────────────────────────────
  { id:  1, name: 'Ofada Rice',              category: 'Grains & Cereals', packSize: '1 kg',  price:  2800, note: 'Aromatic local Ofada variety', errand: false, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=70' },
  { id:  2, name: 'Ofada Rice',              category: 'Grains & Cereals', packSize: '5 kg',  price: 13500, note: 'Aromatic local Ofada variety', errand: false, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=70' },
  { id:  3, name: 'Abakaliki Rice',          category: 'Grains & Cereals', packSize: '1 kg',  price:  2500, note: 'Stone-free parboiled local rice', errand: false, image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&auto=format&fit=crop&q=70' },
  { id:  4, name: 'Abakaliki Rice',          category: 'Grains & Cereals', packSize: '5 kg',  price: 11500, note: 'Stone-free parboiled local rice', errand: false, image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&auto=format&fit=crop&q=70' },
  { id:  5, name: 'Foreign Long-Grain Rice', category: 'Grains & Cereals', packSize: '5 kg',  price: 14500, note: 'Imported long-grain white rice', errand: false, image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&auto=format&fit=crop&q=70' },
  { id:  6, name: 'Foreign Long-Grain Rice', category: 'Grains & Cereals', packSize: '10 kg', price: 27000, note: 'Imported long-grain white rice', errand: false, image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&auto=format&fit=crop&q=70' },
  { id:  7, name: 'White Beans',             category: 'Grains & Cereals', packSize: '1 kg',  price:  2200, note: 'Clean white beans, freshly sorted', errand: false, image: 'https://images.unsplash.com/photo-1612257416918-a9b3d9c3b6f5?w=400&auto=format&fit=crop&q=70' },
  { id:  8, name: 'White Beans',             category: 'Grains & Cereals', packSize: '5 kg',  price:  9800, note: 'Clean white beans, freshly sorted', errand: false, image: 'https://images.unsplash.com/photo-1612257416918-a9b3d9c3b6f5?w=400&auto=format&fit=crop&q=70' },
  { id:  9, name: 'Oloyin Honey Beans',      category: 'Grains & Cereals', packSize: '1 kg',  price:  2600, note: 'Sweet honey beans, freshly sorted', errand: false, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&auto=format&fit=crop&q=70' },
  { id: 10, name: 'Oloyin Honey Beans',      category: 'Grains & Cereals', packSize: '5 kg',  price: 11500, note: 'Sweet honey beans, freshly sorted', errand: false, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&auto=format&fit=crop&q=70' },
  { id: 11, name: 'Brown Beans',             category: 'Grains & Cereals', packSize: '1 kg',  price:  2000, note: 'Drum brown beans, locally sourced', errand: false, image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=400&auto=format&fit=crop&q=70' },
  { id: 12, name: 'Brown Beans',             category: 'Grains & Cereals', packSize: '5 kg',  price:  9000, note: 'Drum brown beans, locally sourced', errand: false, image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=400&auto=format&fit=crop&q=70' },
  { id: 13, name: 'Dried Maize (Corn)',       category: 'Grains & Cereals', packSize: '2 kg',  price:  2800, note: 'Sun-dried whole maize kernels', errand: false, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&auto=format&fit=crop&q=70' },

  // ── Tubers & Root Crops ───────────────────────────
  { id: 14, name: 'Garri (White)',   category: 'Tubers & Root Crops', packSize: '2 kg',  price:  2400, note: 'Light, fluffy white garri', errand: false, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format&fit=crop&q=70' },
  { id: 15, name: 'Garri (White)',   category: 'Tubers & Root Crops', packSize: '5 kg',  price:  5500, note: 'Light, fluffy white garri', errand: false, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format&fit=crop&q=70' },
  { id: 16, name: 'Garri (Yellow)', category: 'Tubers & Root Crops', packSize: '2 kg',  price:  2600, note: 'Crispy Ijebu-style yellow garri', errand: false, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format&fit=crop&q=70' },
  { id: 17, name: 'Garri (Yellow)', category: 'Tubers & Root Crops', packSize: '5 kg',  price:  6000, note: 'Crispy Ijebu-style yellow garri', errand: false, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format&fit=crop&q=70' },
  { id: 18, name: 'Fufu (Cassava)', category: 'Tubers & Root Crops', packSize: '1 kg',  price:  1800, note: 'Smooth fermented cassava fufu', errand: false, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=70' },
  { id: 19, name: 'Yam (Whole)',    category: 'Tubers & Root Crops', packSize: '1 tuber (~3 kg)', price: 3500, note: 'Fresh whole yam tubers', errand: false, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=70' },

  // ── Legumes & Nuts ────────────────────────────────
  { id: 20, name: 'Groundnut (Peanuts)', category: 'Legumes & Nuts', packSize: '1 kg',  price:  2200, note: 'Raw shelled groundnuts', errand: false, image: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=400&auto=format&fit=crop&q=70' },
  { id: 21, name: 'Groundnut (Peanuts)', category: 'Legumes & Nuts', packSize: '3 kg',  price:  6000, note: 'Raw shelled groundnuts', errand: false, image: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=400&auto=format&fit=crop&q=70' },
  { id: 22, name: 'Soya Beans',          category: 'Legumes & Nuts', packSize: '1 kg',  price:  1800, note: 'Whole dried soya beans', errand: false, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=70' },
  { id: 23, name: 'Egusi (Melon Seeds)', category: 'Legumes & Nuts', packSize: '500 g', price:  3500, note: 'Hulled ground egusi seeds', errand: false, image: 'https://images.unsplash.com/photo-1612257416918-a9b3d9c3b6f5?w=400&auto=format&fit=crop&q=70' },
  { id: 24, name: 'Egusi (Melon Seeds)', category: 'Legumes & Nuts', packSize: '1 kg',  price:  6500, note: 'Hulled ground egusi seeds', errand: false, image: 'https://images.unsplash.com/photo-1612257416918-a9b3d9c3b6f5?w=400&auto=format&fit=crop&q=70' },

  // ── Spices & Seasonings ───────────────────────────
  { id: 25, name: 'Ata Rodo (Scotch Bonnet)', category: 'Spices & Seasonings', packSize: '500 g', price:  1800, note: 'Hot fresh scotch bonnet peppers', errand: false, image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&auto=format&fit=crop&q=70' },
  { id: 26, name: 'Dry Pepper (Ground)',       category: 'Spices & Seasonings', packSize: '200 g', price:  1200, note: 'Finely ground dry chilli pepper', errand: false, image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=70' },
  { id: 27, name: 'Curry Powder',              category: 'Spices & Seasonings', packSize: '100 g', price:   800, note: 'Blended curry spice mix', errand: false, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=70' },
  { id: 28, name: 'Thyme',                     category: 'Spices & Seasonings', packSize: '50 g',  price:   600, note: 'Dried whole thyme leaves', errand: false, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=70' },
  { id: 29, name: 'Garlic (Dried/Powdered)',   category: 'Spices & Seasonings', packSize: '100 g', price:   900, note: 'Granulated garlic powder', errand: false, image: 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=400&auto=format&fit=crop&q=70' },
  { id: 30, name: 'Ginger (Ground)',           category: 'Spices & Seasonings', packSize: '100 g', price:   750, note: 'Aromatic ground dried ginger', errand: false, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=70' },
  { id: 31, name: 'Locust Beans (Iru)',        category: 'Spices & Seasonings', packSize: '100 g', price:   800, note: 'Fermented dawadawa locust beans', errand: false, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=70' },
  { id: 32, name: 'Nutmeg & Cloves Mix',       category: 'Spices & Seasonings', packSize: '50 g',  price:   700, note: 'Whole nutmeg and cloves', errand: false, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=70' },
  { id: 33, name: 'Black Pepper (Ground)',      category: 'Spices & Seasonings', packSize: '50 g',  price:   650, note: 'Coarsely ground black pepper', errand: false, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=70' },
  { id: 34, name: 'Maggi Stock Cubes',         category: 'Spices & Seasonings', packSize: '50 cubes', price: 1200, note: 'Classic Maggi seasoning cubes', errand: false, image: 'https://images.unsplash.com/photo-1583792742419-b6e07c1de46a?w=400&auto=format&fit=crop&q=70' },
  { id: 35, name: 'Knorr Stock Cubes',         category: 'Spices & Seasonings', packSize: '50 cubes', price: 1300, note: 'Knorr chicken seasoning cubes', errand: false, image: 'https://images.unsplash.com/photo-1583792742419-b6e07c1de46a?w=400&auto=format&fit=crop&q=70' },

  // ── Oils & Fats ───────────────────────────────────
  { id: 36, name: 'Palm Oil', category: 'Oils & Fats', packSize: '1 L',  price:  2800, note: 'Pure unrefined red palm oil', errand: false, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=70' },
  { id: 37, name: 'Palm Oil', category: 'Oils & Fats', packSize: '4 L',  price: 10500, note: 'Pure unrefined red palm oil', errand: false, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=70' },

  // ── Proteins (Dry/Shelf-Stable) ───────────────────
  { id: 38, name: 'Crayfish (Dry Whole)',  category: 'Proteins', packSize: '200 g', price:  2200, note: 'Sun-dried whole crayfish', errand: false, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=70' },
  { id: 39, name: 'Crayfish (Ground)',     category: 'Proteins', packSize: '200 g', price:  2500, note: 'Coarsely ground crayfish', errand: false, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=70' },
  { id: 40, name: 'Stockfish (Okporoko)', category: 'Proteins', packSize: '500 g', price:  5500, note: 'Norwegian stockfish, well-dried', errand: false, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=70' },
  { id: 41, name: 'Smoked Catfish',       category: 'Proteins', packSize: '500 g', price:  4200, note: 'Locally smoked catfish (Eja osan)', errand: false, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=70' },
  { id: 42, name: 'Dried Prawns',         category: 'Proteins', packSize: '200 g', price:  3200, note: 'Sun-dried prawns for soups', errand: false, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=70' },
  // errand proteins
  { id: 43, name: 'Chicken (Fresh)',      category: 'Proteins', packSize: 'per kg', price:  4500, note: '🛵 Errand — we source fresh for you', errand: true, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&auto=format&fit=crop&q=70' },
  { id: 44, name: 'Beef (Fresh)',         category: 'Proteins', packSize: 'per kg', price:  5500, note: '🛵 Errand — we source fresh for you', errand: true, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&auto=format&fit=crop&q=70' },
  { id: 45, name: 'Goat Meat (Fresh)',    category: 'Proteins', packSize: 'per kg', price:  6000, note: '🛵 Errand — we source fresh for you', errand: true, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&auto=format&fit=crop&q=70' },
  { id: 46, name: 'Turkey (Fresh)',       category: 'Proteins', packSize: 'per kg', price:  5000, note: '🛵 Errand — we source fresh for you', errand: true, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&auto=format&fit=crop&q=70' },
  { id: 47, name: 'Panla (Smoked Fish)',  category: 'Proteins', packSize: '500 g', price:  3800, note: '🛵 Errand — sourced from market', errand: true, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=70' },
  { id: 48, name: 'Snail (Fresh/Frozen)', category: 'Proteins', packSize: 'per pack', price: 4500, note: '🛵 Errand — we source for you', errand: true, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=70' },
  { id: 49, name: 'Periwinkles',          category: 'Proteins', packSize: '500 g', price:  2800, note: '🛵 Errand — fresh market sourced', errand: true, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=70' },

  // ── Vegetables & Leafy Greens (errand) ───────────
  { id: 50, name: 'Ugu (Pumpkin Leaves)', category: 'Vegetables', packSize: 'per bunch', price:  800, note: '🛵 Errand — fresh or dried, seasonal', errand: true, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=70' },
  { id: 51, name: 'Waterleaf',            category: 'Vegetables', packSize: 'per bunch', price:  600, note: '🛵 Errand — fresh seasonal leaves', errand: true, image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&auto=format&fit=crop&q=70' },
  { id: 52, name: 'Scent Leaf (Efirin)',  category: 'Vegetables', packSize: 'per bunch', price:  500, note: '🛵 Errand — aromatic fresh leaves', errand: true, image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&auto=format&fit=crop&q=70' },
  { id: 53, name: 'Ewedu (Jute Leaves)', category: 'Vegetables', packSize: 'per bunch', price:  600, note: '🛵 Errand — fresh Yoruba ewedu', errand: true, image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&auto=format&fit=crop&q=70' },
  { id: 54, name: 'Okra (Fresh)',         category: 'Vegetables', packSize: '500 g',    price:  900, note: '🛵 Errand — fresh whole okra pods', errand: true, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format&fit=crop&q=70' },
  { id: 55, name: 'Spinach',              category: 'Vegetables', packSize: 'per bunch', price:  700, note: '🛵 Errand — fresh spinach leaves', errand: true, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=70' },
  { id: 56, name: 'Tomatoes (Fresh)',     category: 'Vegetables', packSize: '1 kg',     price: 1500, note: '🛵 Errand — ripe market tomatoes', errand: true, image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&auto=format&fit=crop&q=70' },

  // ── Fruits (errand) ───────────────────────────────
  { id: 57, name: 'Plantain',   category: 'Fruits', packSize: 'per finger (~1 kg)', price: 1200, note: '🛵 Errand — ripe or unripe', errand: true, image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=70' },
  { id: 58, name: 'Pineapple',  category: 'Fruits', packSize: 'per piece',          price: 1500, note: '🛵 Errand — sweet ripe pineapple', errand: true, image: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400&auto=format&fit=crop&q=70' },
  { id: 59, name: 'Oranges',    category: 'Fruits', packSize: 'per dozen',          price: 1800, note: '🛵 Errand — fresh sweet oranges', errand: true, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&auto=format&fit=crop&q=70' },
  { id: 60, name: 'Watermelon', category: 'Fruits', packSize: 'per piece',          price: 4000, note: '🛵 Errand — large ripe watermelon', errand: true, image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&auto=format&fit=crop&q=70' },

  // ── Gas (Cooking) ─────────────────────────────────
  { id: 61, name: 'Cooking Gas', category: 'Gas', packSize: '3 kg',  price:  4500, note: 'LPG cylinder refill — 3 kg', errand: false, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=70' },
  { id: 62, name: 'Cooking Gas', category: 'Gas', packSize: '5 kg',  price:  7200, note: 'LPG cylinder refill — 5 kg', errand: false, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=70' },
  { id: 63, name: 'Cooking Gas', category: 'Gas', packSize: '12.5 kg', price: 17000, note: 'LPG cylinder refill — 12.5 kg', errand: false, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=70' },
]

const STORAGE_KEY = 'dbf_saved_list'

// ── Types ───────────────────────────────────────────────────────────────────
type SavedList = { name: string; cart: Record<number, number> }

export function Shop() {
  const [selectedMode, setSelectedMode] = useState<OrderMode>('purchase')
  const [selectedZone, setSelectedZone] = useState<string>(deliveryZones[0].id)
  const [customerName, setCustomerName] = useState('')
  const [whatsAppNumber, setWhatsAppNumber] = useState('')
  const [errandNote, setErrandNote] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
  })
  const [saveListName, setSaveListName] = useState('')
  const [showSavePanel, setShowSavePanel] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  // persist saved lists
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLists))
  }, [savedLists])

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2800)
  }

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = useMemo(() => products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.note.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [search, activeCategory])

  const addToCart = (id: number) => { setSubmitted(false); setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 })) }
  const removeFromCart = (id: number) => {
    setSubmitted(false)
    setCart(c => {
      const next = (c[id] ?? 0) - 1
      if (next <= 0) { const { [id]: _, ...rest } = c; return rest }
      return { ...c, [id]: next }
    })
  }

  const cartItems = products.filter(p => cart[p.id]).map(p => ({ ...p, quantity: cart[p.id], total: cart[p.id] * p.price }))
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.total, 0)
  const selectedZoneDetails = deliveryZones.find(z => z.id === selectedZone) ?? deliveryZones[0]
  const deposit = Math.ceil(subtotal * 0.3)
  const canSubmit = cartCount > 0 || errandNote.trim().length > 0

  const saveList = () => {
    if (!saveListName.trim()) return
    const entry: SavedList = { name: saveListName.trim(), cart: { ...cart } }
    setSavedLists(prev => [entry, ...prev.filter(l => l.name !== entry.name)])
    setSaveListName('')
    setShowSavePanel(false)
    showToast(`"${entry.name}" saved — load it anytime!`)
  }

  const loadList = (list: SavedList) => {
    setCart(list.cart)
    showToast(`Loaded "${list.name}"`)
  }

  const deleteList = (name: string) => {
    setSavedLists(prev => prev.filter(l => l.name !== name))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitted(true)
  }

  return (
    <main className="shop-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #f7f4ed;
          --olive: #4a5e2f;
          --olive-lt: #6b8042;
          --olive-pale: #eef2e6;
          --tan: #c8b97a;
          --brown: #2d2416;
          --muted: #7a7060;
          --card: #ffffff;
          --border: #e8e2d4;
          --radius: 16px;
          --shadow-sm: 0 2px 8px rgba(45,36,22,.07);
          --shadow-md: 0 6px 24px rgba(45,36,22,.12);
          --t: .22s cubic-bezier(.4,0,.2,1);
        }

        .shop-shell {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          color: var(--brown);
        }

        /* ── Toast ── */
        .toast {
          position: fixed; top: 1.25rem; right: 1.25rem; z-index: 999;
          background: var(--olive); color: #fff;
          padding: .7rem 1.2rem; border-radius: 100px;
          font-size: .85rem; font-weight: 600;
          box-shadow: var(--shadow-md);
          animation: slideIn .3s ease;
          pointer-events: none;
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }

        /* ── Layout ── */
        .shop-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          padding: 2rem clamp(1rem, 4vw, 3rem);
          max-width: 1400px;
          margin: 0 auto;
          align-items: start;
        }

        /* ── Catalog column ── */
        .catalog-col { min-width: 0; }

        .catalog-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .catalog-title { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; }

        /* search */
        .search-wrap {
          position: relative; flex: 1; min-width: 180px; max-width: 320px;
        }
        .search-wrap svg { position: absolute; left: .9rem; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
        .search-input {
          width: 100%; padding: .6rem .9rem .6rem 2.4rem;
          border: 1.5px solid var(--border); border-radius: 100px;
          background: var(--card); font-family: 'DM Sans', sans-serif;
          font-size: .9rem; color: var(--brown); outline: none;
          transition: border-color var(--t);
        }
        .search-input:focus { border-color: var(--olive); }

        /* category pills */
        .cat-row { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.5rem; }
        .cat-pill {
          padding: .35rem .9rem; border-radius: 100px; border: 1.5px solid var(--border);
          background: var(--card); font-size: .8rem; font-weight: 600; cursor: pointer;
          color: var(--muted); transition: all var(--t);
        }
        .cat-pill:hover { border-color: var(--olive-lt); color: var(--olive-lt); }
        .cat-pill.active { background: var(--olive); border-color: var(--olive); color: #fff; }

        /* product grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .product-card {
          background: var(--card);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform var(--t), box-shadow var(--t);
          display: flex; flex-direction: column;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

        .product-img {
          width: 100%; aspect-ratio: 4/3;
          object-fit: cover; display: block;
          transition: transform .4s ease;
        }
        .product-card:hover .product-img { transform: scale(1.05); }
        .img-wrap { overflow: hidden; position: relative; }

        .cat-badge {
          position: absolute; top: .6rem; left: .6rem;
          background: rgba(255,255,255,.88); backdrop-filter: blur(6px);
          border-radius: 100px; padding: .2rem .65rem;
          font-size: .7rem; font-weight: 700; color: var(--olive);
          letter-spacing: .04em;
        }
        .errand-badge {
          position: absolute; top: .6rem; right: .6rem;
          background: #fff3cd; border-radius: 100px; padding: .2rem .55rem;
          font-size: .65rem; font-weight: 700; color: #7a5c00;
          letter-spacing: .04em;
        }

        .product-body { padding: .9rem 1rem 1rem; flex: 1; display: flex; flex-direction: column; gap: .4rem; }
        .product-body h3 { font-size: .95rem; font-weight: 700; line-height: 1.3; }
        .product-body p { font-size: .78rem; color: var(--muted); line-height: 1.5; flex: 1; }

        .product-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: .6rem;
        }
        .product-price { font-size: 1rem; font-weight: 700; color: var(--olive); }
        .pack-size { font-size: .72rem; color: var(--muted); margin-top: .1rem; }

        .cart-btn-group { display: flex; align-items: center; gap: .4rem; }
        .icon-btn {
          width: 30px; height: 30px; border-radius: 50%; border: none;
          background: var(--olive-pale); color: var(--olive);
          font-size: 1.1rem; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background var(--t);
        }
        .icon-btn:hover { background: var(--olive); color: #fff; }
        .add-btn {
          padding: .45rem 1rem; border-radius: 100px;
          background: var(--olive); color: #fff; border: none;
          font-size: .82rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background var(--t);
        }
        .add-btn:hover { background: #3a4a22; }
        .qty-badge { font-size: .88rem; font-weight: 700; min-width: 18px; text-align: center; }

        /* ── Sidebar ── */
        .sidebar-col { position: sticky; top: 1.5rem; }

        .sidebar-card {
          background: var(--card);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .sidebar-header {
          background: var(--olive);
          color: #fff;
          padding: 1.1rem 1.25rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sidebar-header h2 { font-family: 'Playfair Display', serif; font-size: 1.15rem; }
        .cart-count-badge {
          background: var(--tan); color: var(--brown);
          border-radius: 100px; padding: .2rem .65rem;
          font-size: .8rem; font-weight: 700;
        }

        .sidebar-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

        /* saved lists */
        .saved-section { border-bottom: 1.5px solid var(--border); padding-bottom: 1rem; }
        .saved-label { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: .6rem; }
        .saved-row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
        .saved-chip {
          display: flex; align-items: center; gap: .35rem;
          background: var(--olive-pale); border-radius: 100px;
          padding: .3rem .75rem; font-size: .78rem; font-weight: 600; color: var(--olive);
          cursor: pointer; border: 1.5px solid transparent;
          transition: all var(--t);
        }
        .saved-chip:hover { border-color: var(--olive); }
        .saved-chip .del { color: var(--muted); font-size: .8rem; margin-left: .15rem; line-height: 1; }
        .saved-chip .del:hover { color: #c0392b; }
        .no-saved { font-size: .8rem; color: var(--muted); }

        /* save panel */
        .save-toggle {
          display: flex; align-items: center; gap: .4rem;
          font-size: .8rem; font-weight: 600; color: var(--olive);
          cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif;
          padding: 0; margin-top: .4rem;
        }
        .save-panel { display: flex; gap: .5rem; margin-top: .6rem; }
        .save-input {
          flex: 1; padding: .5rem .8rem; border: 1.5px solid var(--border); border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: .85rem; color: var(--brown); outline: none;
        }
        .save-input:focus { border-color: var(--olive); }
        .save-confirm {
          padding: .5rem 1rem; border-radius: 8px; background: var(--olive);
          color: #fff; border: none; font-size: .82rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        /* cart list */
        .cart-list { display: flex; flex-direction: column; gap: .6rem; }
        .cart-item {
          display: flex; align-items: center; justify-content: space-between; gap: .5rem;
          padding: .6rem .8rem; background: var(--cream); border-radius: 10px;
        }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-info strong { display: block; font-size: .85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cart-item-info span { font-size: .75rem; color: var(--muted); }
        .cart-stepper { display: flex; align-items: center; gap: .35rem; }

        .empty-state { font-size: .85rem; color: var(--muted); text-align: center; padding: 1rem 0; }

        /* form */
        .order-form { display: flex; flex-direction: column; gap: .75rem; }
        .order-form label { display: flex; flex-direction: column; gap: .3rem; font-size: .8rem; font-weight: 600; color: var(--brown); }
        .order-form input, .order-form select, .order-form textarea {
          padding: .55rem .8rem; border: 1.5px solid var(--border); border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: .88rem; color: var(--brown);
          background: var(--cream); outline: none; transition: border-color var(--t);
        }
        .order-form input:focus, .order-form select:focus, .order-form textarea:focus { border-color: var(--olive); background: #fff; }

        .charge-box { background: var(--olive-pale); border-radius: 10px; padding: .75rem .9rem; display: flex; flex-direction: column; gap: .4rem; }
        .charge-box > div { display: flex; justify-content: space-between; font-size: .82rem; }
        .charge-box > div span { color: var(--muted); }
        .charge-box > div strong { color: var(--brown); }

        .submit-btn {
          width: 100%; padding: .85rem; background: var(--olive); color: #fff;
          border: none; border-radius: 12px; font-size: .95rem; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background var(--t);
        }
        .submit-btn:hover:not(:disabled) { background: #3a4a22; }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        .success-box {
          background: #eef5e6; border: 1.5px solid #b0cc88; border-radius: 12px;
          padding: .85rem 1rem;
        }
        .success-box strong { display: block; font-size: .9rem; color: var(--olive); margin-bottom: .3rem; }
        .success-box p { font-size: .8rem; color: var(--muted); line-height: 1.5; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .shop-layout { grid-template-columns: 1fr; }
          .sidebar-col { position: static; }
        }
        @media (max-width: 560px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: .75rem; }
          .catalog-header { flex-direction: column; align-items: flex-start; }
          .search-wrap { max-width: 100%; width: 100%; }
          .shop-layout { padding: 1rem; gap: 1.5rem; }
        }
        @media (max-width: 360px) {
          .product-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {toastMsg && <div className="toast">{toastMsg}</div>}

      <div className="shop-layout">
        {/* ── Catalog column ── */}
        <div className="catalog-col">
          <div className="catalog-header">
            <h2 className="catalog-title">Shop Essentials</h2>
            <div className="search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                className="search-input"
                type="search"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="cat-row">
            {categories.map(cat => (
              <button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filtered.length === 0 && (
              <p style={{ gridColumn: '1/-1', color: 'var(--muted)', fontSize: '.9rem' }}>No products match your search.</p>
            )}
            {filtered.map(product => (
              <article key={product.id} className="product-card">
                <div className="img-wrap">
                  <img className="product-img" src={product.image} alt={product.name} loading="lazy" />
                  <span className="cat-badge">{product.category}</span>
                  {product.errand && <span className="errand-badge">🛵 Errand</span>}
                </div>
                <div className="product-body">
                  <h3>{product.name}</h3>
                  <p>{product.note}</p>
                  <div className="product-footer">
                    <div>
                      <div className="product-price">₦{product.price.toLocaleString('en-NG')}</div>
                      <div className="pack-size">{product.packSize}</div>
                    </div>
                    {cart[product.id] ? (
                      <div className="cart-btn-group">
                        <button className="icon-btn" onClick={() => removeFromCart(product.id)}>−</button>
                        <span className="qty-badge">{cart[product.id]}</span>
                        <button className="icon-btn" onClick={() => addToCart(product.id)}>+</button>
                      </div>
                    ) : (
                      <button className="add-btn" onClick={() => addToCart(product.id)}>Add</button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="sidebar-col">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <h2>Your Order</h2>
              <span className="cart-count-badge">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
            </div>

            <div className="sidebar-body">
              {/* Saved lists */}
              <div className="saved-section">
                <div className="saved-label">Saved lists</div>
                {savedLists.length === 0
                  ? <p className="no-saved">No saved lists yet. Save your current cart for quick reorder.</p>
                  : (
                    <div className="saved-row">
                      {savedLists.map(list => (
                        <div key={list.name} className="saved-chip" onClick={() => loadList(list)}>
                          📋 {list.name}
                          <button className="del" onClick={e => { e.stopPropagation(); deleteList(list.name) }} title="Remove">×</button>
                        </div>
                      ))}
                    </div>
                  )
                }

                {cartCount > 0 && (
                  <>
                    <button className="save-toggle" onClick={() => setShowSavePanel(v => !v)}>
                      {showSavePanel ? '↑ Cancel' : '＋ Save this list'}
                    </button>
                    {showSavePanel && (
                      <div className="save-panel">
                        <input
                          className="save-input"
                          placeholder="List name (e.g. Weekly groceries)"
                          value={saveListName}
                          onChange={e => setSaveListName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveList()}
                        />
                        <button className="save-confirm" onClick={saveList}>Save</button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Cart items */}
              {cartItems.length === 0 ? (
                <p className="empty-state">Your cart is empty. Add items or load a saved list.</p>
              ) : (
                <div className="cart-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span>₦{item.total.toLocaleString('en-NG')}</span>
                      </div>
                      <div className="cart-stepper">
                        <button className="icon-btn" onClick={() => removeFromCart(item.id)}>−</button>
                        <span className="qty-badge">{item.quantity}</span>
                        <button className="icon-btn" onClick={() => addToCart(item.id)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order form */}
              <form className="order-form" onSubmit={handleSubmit}>
                <label>
                  Full name
                  <input type="text" placeholder="Customer name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </label>

                <label>
                  WhatsApp number
                  <input type="tel" placeholder="e.g. 0800 000 0000" value={whatsAppNumber} onChange={e => setWhatsAppNumber(e.target.value)} />
                </label>

                <label>
                  Delivery area
                  <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
                    {deliveryZones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.label}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Order type
                  <select value={selectedMode} onChange={e => setSelectedMode(e.target.value as OrderMode)}>
                    {orderModes.map(mode => (
                      <option key={mode.id} value={mode.id}>{mode.title}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Errand request
                  <textarea rows={3} placeholder="Extra things you need us to help buy." value={errandNote} onChange={e => setErrandNote(e.target.value)} />
                </label>

                <div className="charge-box">
                  <div><span>Delivery fee</span><strong>{selectedZoneDetails.fee}</strong></div>
                  <div><span>Est. time</span><strong>{selectedZoneDetails.eta}</strong></div>
                  <div><span>Subtotal</span><strong>₦{subtotal.toLocaleString('en-NG')}</strong></div>
                  <div><span>30% deposit</span><strong>₦{deposit.toLocaleString('en-NG')}</strong></div>
                </div>

                <button type="submit" className="submit-btn" disabled={!canSubmit}>
                  Submit order request
                </button>
              </form>

              {submitted && (
                <div className="success-box" role="status">
                  <strong>Order request ready ✓</strong>
                  <p>We'll confirm via WhatsApp, then collect 30% deposit before delivery.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}