import { useState, useMemo, useEffect, useCallback } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { OrderMode } from '../data'
import { deliveryZones } from '../data'
import { products } from '../data/products'
import type { UomOption } from '../data/products'

const STORAGE_KEY = 'dbf_saved_list'
const ACTIVE_SESSION_KEY = 'dbf_active_shop_session'
const ACTIVE_ERRAND_SESSION_KEY = 'dbf_active_errand_session'

// ── Types ───────────────────────────────────────────────────────────────────
type SavedList = { name: string; cart: Record<number, number>; uomSelections?: Record<number, number> }

export function Shop() {
  const navigate = useNavigate()
  const [selectedMode] = useState<OrderMode>('purchase')
  const [selectedZone, setSelectedZone] = useState<string>(() => {
    try { return JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY) ?? '{}')?.selectedZone ?? deliveryZones[0].id } catch { return deliveryZones[0].id }
  })
  const [customerName, setCustomerName] = useState('')
  const [whatsAppNumber, setWhatsAppNumber] = useState('')
  const [errandNote, setErrandNote] = useState('')
  const [cart, setCart] = useState<Record<number, number>>(() => {
    try { return JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY) ?? '{}')?.cart ?? {} } catch { return {} }
  })
  const [uomSelections, setUomSelections] = useState<Record<number, number>>(() => {
    try { return JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY) ?? '{}')?.uomSelections ?? {} } catch { return {} }
  })
  const [submitted, setSubmitted] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
  })
  const [saveListName, setSaveListName] = useState('')
  const [showSavePanel, setShowSavePanel] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const [showErrandModal, setShowErrandModal] = useState(false)
  const [hasSeenErrandPrompt, setHasSeenErrandPrompt] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLists))
  }, [savedLists])

  useEffect(() => {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ cart, uomSelections, selectedZone }))
  }, [cart, uomSelections, selectedZone])

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2800)
  }

  const categories = useMemo(() => {
    const nonErrandProducts = products.filter(p => !p.errand);
    return ['All', ...Array.from(new Set(nonErrandProducts.map(p => p.category)))];
  }, []);

  const filtered = useMemo(() => products.filter(p => {
    if (selectedMode === 'purchase' && p.errand) return false;
    if (selectedMode === 'errand' && !p.errand) return false;
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [search, activeCategory, selectedMode]);

  const effectiveUomLabel = useCallback((id: number): string => {
    const p = products.find(x => x.id === id)
    if (!p || !p.uom) return ''
    const idx = uomSelections[id] ?? 0
    return p.uom[idx]?.label ?? ''
  }, [uomSelections]);

  const getSelectedUomPrice = useCallback((id: number): number => {
    const product = products.find(p => p.id === id);
    if (!product || !product.uom || product.uom.length === 0) return 0;
    const selectedIdx = uomSelections[id] ?? 0;
    return product.uom[selectedIdx]?.price ?? 0;
  }, [uomSelections]);

  const addToCart = (id: number) => { setSubmitted(false); setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 })) }
  const removeFromCart = (id: number) => {
    setSubmitted(false)
    setCart(c => {
      const next = (c[id] ?? 0) - 1
      if (next <= 0) { const nc = { ...c }; delete nc[id]; return nc }
      return { ...c, [id]: next }
    })
  }

  const cartItems = useMemo(() => {
    return products.filter(p => cart[p.id]).map(p => {
      const qty = cart[p.id];
      const unitPrice = getSelectedUomPrice(p.id);
      return { ...p, quantity: qty, unitPrice, total: qty * unitPrice, uomLabel: effectiveUomLabel(p.id) };
    });
  }, [cart, getSelectedUomPrice, effectiveUomLabel]);

  const [errandItemsForInvoice] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_ERRAND_SESSION_KEY);
      if (!stored) return [];
      const { cart: eCart, uomSelections: eUom } = JSON.parse(stored);
      return products.filter(p => eCart[p.id]).map(p => {
        const qty = eCart[p.id];
        const idx = (eUom ?? {})[p.id] ?? 0;
        const unitPrice = p.uom[idx]?.price ?? 0;
        const uomLabel = p.uom[idx]?.label ?? '';
        return { name: p.name, quantity: qty, uomLabel, total: qty * unitPrice };
      });
    } catch { return []; }
  });

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const shopSubtotal = cartItems.reduce((s, i) => s + i.total, 0)

  const [errandSubtotal] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_ERRAND_SESSION_KEY);
      if (!stored) return 0;
      const { cart: eCart, uomSelections: eUom } = JSON.parse(stored);
      return Object.entries(eCart as Record<number, number>).reduce((total, [idStr, qty]) => {
        const id = Number(idStr);
        const p = products.find(x => x.id === id);
        if (!p || !p.uom) return total;
        const idx = (eUom ?? {})[id] ?? 0;
        const unitPrice = p.uom[idx]?.price ?? 0;
        return total + (qty * unitPrice);
      }, 0);
    } catch { return 0; }
  });

  const combinedSubtotal = shopSubtotal + errandSubtotal

  const selectedZoneDetails = deliveryZones.find(z => z.id === selectedZone) ?? deliveryZones[0]
  const deliveryFeeNum = parseInt(selectedZoneDetails.fee.replace(/[^\d]/g, ''), 10) || 0
  const errandTips = errandSubtotal > 0 ? 1000 : 0
  const totalAmount = combinedSubtotal + errandTips + deliveryFeeNum
  const deposit = Math.ceil((shopSubtotal + deliveryFeeNum) * 0.5)
  const canSubmit = cartCount > 0 || errandNote.trim().length > 0

  const saveList = () => {
    if (!saveListName.trim()) return
    const entry: SavedList = { name: saveListName.trim(), cart: { ...cart }, uomSelections: { ...uomSelections } }
    setSavedLists(prev => [entry, ...prev.filter(l => l.name !== entry.name)])
    setSaveListName('')
    setShowSavePanel(false)
    showToast(`"${entry.name}" saved!`)
  }

  const loadList = (list: SavedList) => {
    setCart(list.cart)
    if (list.uomSelections) setUomSelections(list.uomSelections)
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
          --radius: 14px;
          --shadow-sm: 0 2px 6px rgba(45,36,22,.07);
          --shadow-md: 0 6px 20px rgba(45,36,22,.12);
          --t: .2s cubic-bezier(.4,0,.2,1);
        }

        .shop-shell {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          color: var(--brown);
        }

        /* ── Toast ── */
        .toast {
          position: fixed; top: 1rem; right: 1rem; z-index: 9999;
          background: var(--olive); color: #fff;
          padding: .55rem 1rem; border-radius: 100px;
          font-size: .82rem; font-weight: 600;
          box-shadow: var(--shadow-md);
          animation: slideIn .25s ease;
          pointer-events: none;
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

        /* ── Layout ── */
        .shop-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          padding: 1.5rem clamp(.75rem, 3vw, 2.5rem);
          max-width: 1400px;
          margin: 0 auto;
          align-items: start;
        }

        .catalog-col { min-width: 0; }

        .back-link {
          display: inline-flex; align-items: center; gap: .4rem;
          text-decoration: none; color: var(--olive); font-weight: 600;
          font-size: .85rem; margin-bottom: .6rem; cursor: pointer;
        }

        .catalog-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: .75rem;
          margin-bottom: 1rem;
        }

        .catalog-title { font-family: 'Playfair Display', serif; font-size: clamp(1.3rem,2.5vw,1.7rem); font-weight: 800; }

        .search-wrap { position: relative; flex: 1; min-width: 160px; max-width: 280px; }
        .search-wrap svg { position: absolute; left: .8rem; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
        .search-input {
          width: 100%; padding: .5rem .8rem .5rem 2.2rem;
          border: 1.5px solid var(--border); border-radius: 100px;
          background: var(--card); font-family: 'DM Sans', sans-serif;
          font-size: .85rem; color: var(--brown); outline: none;
          transition: border-color var(--t);
        }
        .search-input:focus { border-color: var(--olive); }

        .cat-row { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1rem; }
        .cat-pill {
          padding: .28rem .8rem; border-radius: 100px; border: 1.5px solid var(--border);
          background: var(--card); font-size: .75rem; font-weight: 600; cursor: pointer;
          color: var(--muted); transition: all var(--t);
        }
        .cat-pill:hover { border-color: var(--olive-lt); color: var(--olive-lt); }
        .cat-pill.active { background: var(--olive); border-color: var(--olive); color: #fff; }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 1rem;
        }

        .product-card {
          background: var(--card);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform var(--t), box-shadow var(--t);
          display: flex; flex-direction: column;
        }
        .product-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

        .product-img {
          width: 100%; aspect-ratio: 4/3;
          object-fit: cover; display: block;
          transition: transform .35s ease;
        }
        .product-card:hover .product-img { transform: scale(1.04); }
        .img-wrap { overflow: hidden; position: relative; }

        .cat-badge {
          position: absolute; top: .45rem; left: .45rem;
          background: rgba(255,255,255,.88); backdrop-filter: blur(6px);
          border-radius: 100px; padding: .15rem .55rem;
          font-size: .65rem; font-weight: 700; color: var(--olive);
          letter-spacing: .04em;
        }
        .errand-badge {
          position: absolute; top: .45rem; right: .45rem;
          background: #fff3cd; border-radius: 100px; padding: .15rem .45rem;
          font-size: .62rem; font-weight: 700; color: #7a5c00;
        }

        .product-body { padding: .65rem .75rem .75rem; flex: 1; display: flex; flex-direction: column; gap: .3rem; }
        .product-body h3 { font-size: .7rem; font-weight: 700; line-height: 1.3; }
        .product-body p { font-size: .72rem; color: var(--muted); line-height: 1.45; flex: 1; }

        .uom-select {
          width: 100%;
          padding: .45rem .7rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: .60rem;
          font-weight: 600;
          color: var(--olive);
          background: var(--olive-pale);
          outline: none;
          cursor: pointer;
          transition: border-color var(--t);
          margin-bottom: .1rem;
        }
        .uom-select:focus { border-color: var(--olive); }

        .product-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: .4rem; gap: .4rem;
        }
        .product-price { font-size: .88rem; font-weight: 700; color: var(--olive); }

        .cart-btn-group { display: flex; align-items: center; gap: .3rem; }
        .icon-btn {
          width: 26px; height: 26px; border-radius: 50%; border: none;
          background: var(--olive-pale); color: var(--olive);
          font-size: 1rem; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background var(--t);
        }
        .icon-btn:hover { background: var(--olive); color: #fff; }
        .add-btn {
          padding: .35rem .85rem; border-radius: 100px;
          background: var(--olive); color: #fff; border: none;
          font-size: .78rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background var(--t);
        }
        .add-btn:hover { background: #3a4a22; }
        .qty-badge { font-size: .82rem; font-weight: 700; min-width: 16px; text-align: center; }

        /* ── Sidebar ── */
        .sidebar-col { position: sticky; top: 1.25rem; }

        .sidebar-card {
          background: var(--card);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .sidebar-header {
          background: #02792e; color: var(--brown);
          padding: .9rem 1.1rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sidebar-header h2 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #fff; }
        .cart-count-badge {
          background: var(--tan); color: var(--brown);
          border-radius: 100px; padding: .15rem .6rem;
          font-size: .76rem; font-weight: 700;
        }

        .sidebar-body { padding: 1rem; display: flex; flex-direction: column; gap: .85rem; }

        .saved-section { border-bottom: 1.5px solid var(--border); padding-bottom: .85rem; }
        .saved-label { font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: .5rem; }
        .saved-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
        .saved-chip {
          display: flex; align-items: center; gap: .3rem;
          background: var(--olive-pale); border-radius: 100px;
          padding: .25rem .65rem; font-size: .75rem; font-weight: 600; color: var(--olive);
          cursor: pointer; border: 1.5px solid transparent;
          transition: all var(--t);
        }
        .saved-chip:hover { border-color: var(--olive); }
        .saved-chip .del { color: var(--muted); font-size: .78rem; margin-left: .1rem; }
        .saved-chip .del:hover { color: #c0392b; }
        .no-saved { font-size: .76rem; color: var(--muted); }

        .save-toggle {
          display: flex; align-items: center; gap: .35rem;
          font-size: .76rem; font-weight: 600; color: var(--olive);
          cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif;
          padding: 0; margin-top: .35rem;
        }
        .save-panel { display: flex; gap: .4rem; margin-top: .5rem; }
        .save-input {
          flex: 1; padding: .4rem .7rem; border: 1.5px solid var(--border); border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: .82rem; color: var(--brown); outline: none;
        }
        .save-input:focus { border-color: var(--olive); }
        .save-confirm {
          padding: .4rem .9rem; border-radius: 8px; background: var(--olive);
          color: #fff; border: none; font-size: .78rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .cart-list { display: flex; flex-direction: column; gap: .5rem; }
        .cart-item {
          display: flex; align-items: center; justify-content: space-between; gap: .4rem;
          padding: .5rem .65rem; background: var(--cream); border-radius: 9px;
        }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-info strong { display: block; font-size: .8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cart-item-info span { font-size: .7rem; color: var(--muted); }
        .cart-stepper { display: flex; align-items: center; gap: .3rem; }

        .empty-state { font-size: .82rem; color: var(--muted); text-align: center; padding: .75rem 0; }

        .order-form { display: flex; flex-direction: column; gap: .65rem; }
        .order-form label { display: flex; flex-direction: column; gap: .25rem; font-size: .76rem; font-weight: 600; color: var(--brown); }
        .order-form input, .order-form select, .order-form textarea {
          padding: .48rem .7rem; border: 1.5px solid var(--border); border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: .84rem; color: var(--brown);
          background: var(--cream); outline: none; transition: border-color var(--t);
        }
        .order-form input:focus, .order-form select:focus, .order-form textarea:focus { border-color: var(--olive); background: #fff; }

        /* ── Charge box ── */
        .charge-box {
          background: #fdf2e9; border: 1px solid #f5d7b5; border-radius: 9px;
          padding: .65rem .8rem; display: flex; flex-direction: column; gap: .35rem;
        }
        .charge-box > div { display: flex; justify-content: space-between; font-size: .79rem; }
        .charge-box > div span { color: var(--muted); }
        .charge-box > div strong { color: var(--brown); }
        .charge-section-label {
          font-size: .64rem; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: var(--muted);
          padding-bottom: .25rem; margin-top: .1rem;
          border-bottom: 1px dashed #e8d5b7;
        }
        .charge-divider {
          border: none; border-top: 1px solid #f0c9a0; margin: .15rem 0;
        }
        .charge-total-row {
          display: flex; justify-content: space-between; font-size: .84rem;
          font-weight: 700; color: var(--brown);
        }
        .charge-total-row span { color: var(--brown); }

        .submit-btn {
          width: 100%; padding: .75rem; background: var(--olive); color: #fff;
          border: none; border-radius: 11px; font-size: .9rem; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background var(--t);
        }
        .submit-btn:hover:not(:disabled) { background: #3a4a22; }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        .success-box {
          background: #eef5e6; border: 1.5px solid #b0cc88; border-radius: 11px;
          padding: .75rem .9rem;
        }
        .success-box strong { display: block; font-size: .86rem; color: var(--olive); margin-bottom: .25rem; }
        .success-box p { font-size: .76rem; color: var(--muted); line-height: 1.5; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .shop-layout { grid-template-columns: 1fr; }
          .sidebar-col { position: static; }
        }
        @media (max-width: 560px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: .65rem; }
          .catalog-header { flex-direction: column; align-items: flex-start; }
          .search-wrap { max-width: 100%; width: 100%; }
          .shop-layout { padding: .75rem; gap: 1.25rem; }
        }
        @media (max-width: 360px) {
          .product-grid { grid-template-columns: 1fr; }
        }

        /* ── Errand Modal ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(45, 36, 22, 0.6);
          backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem; animation: fadeOverlay .22s ease;
        }
        @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }

        .modal-content {
          background: var(--card); border-radius: 22px;
          padding: 2.25rem 2rem 2rem; max-width: 440px; width: 100%;
          box-shadow: 0 32px 80px rgba(45,36,22,.28), 0 2px 8px rgba(45,36,22,.08);
          text-align: center; animation: popIn .28s cubic-bezier(.34,1.56,.64,1);
          position: relative; border: 1.5px solid var(--border);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(.84) translateY(20px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }

        .modal-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--olive-pale); font-size: 2rem;
          margin-bottom: 1.1rem; border: 2px solid #d4e4b8;
        }

        .modal-content h3 {
          font-family: 'Playfair Display', serif; font-size: 1.4rem;
          font-weight: 800; color: var(--brown); margin-bottom: .6rem; line-height: 1.3;
        }

        .modal-content p {
          font-size: .88rem; color: var(--muted); line-height: 1.65;
          margin-bottom: 1.75rem; max-width: 320px;
          margin-left: auto; margin-right: auto;
        }

        .modal-divider { height: 1px; background: var(--border); margin: 0 -2rem 1.5rem; }

        .modal-actions { display: flex; gap: .75rem; justify-content: center; }

        .modal-btn {
          flex: 1; padding: .78rem 1rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: .88rem; font-weight: 700;
          cursor: pointer; border: 2px solid transparent; transition: all var(--t); line-height: 1;
        }
        .modal-btn.no {
          background: var(--cream); color: var(--brown); border-color: var(--border);
        }
        .modal-btn.no:hover {
          border-color: var(--olive-lt); color: var(--olive);
          background: var(--olive-pale); transform: translateY(-1px);
        }
        .modal-btn.yes {
          background: var(--olive); color: #fff; border-color: var(--olive);
          box-shadow: 0 4px 14px rgba(74,94,47,.35);
        }
        .modal-btn.yes:hover {
          background: #3a4a22; border-color: #3a4a22;
          box-shadow: 0 6px 20px rgba(74,94,47,.45); transform: translateY(-1px);
        }
        .modal-btn.yes::after { content: ' →'; opacity: .8; }

        /* ── Invoice ── */
        .invoice-overlay {
          position: fixed; inset: 0; z-index: 3000;
          background: rgba(255, 255, 255, 0.98); padding: 2rem 1rem;
          overflow-y: auto; display: flex; flex-direction: column; align-items: center;
        }
        .invoice-paper {
          max-width: 500px; width: 100%; background: #fff; border: 1px solid var(--border);
          padding: 2.5rem; border-radius: 4px; box-shadow: var(--shadow-sm);
        }
        .invoice-header { border-bottom: 2px solid var(--brown); padding-bottom: 1rem; margin-bottom: 1.5rem; text-align: center; }
        .invoice-header h1 { font-family: 'Playfair Display', serif; font-size: 1.6rem; text-transform: uppercase; letter-spacing: .05em; }
        .invoice-section { margin-bottom: 1.5rem; }
        .invoice-section h4 { font-size: .75rem; text-transform: uppercase; color: var(--muted); margin-bottom: .6rem; border-bottom: 1px solid var(--border); padding-bottom: .2rem; }
        .invoice-row { display: flex; justify-content: space-between; font-size: .85rem; margin-bottom: .4rem; }
        .invoice-row.total { border-top: 2px solid var(--brown); padding-top: .6rem; margin-top: .6rem; font-weight: 800; font-size: 1rem; }
        .calc-breakdown { font-size: .75rem; color: var(--muted); font-style: italic; margin-top: .5rem; line-height: 1.4; background: var(--olive-pale); padding: .75rem; border-radius: 8px; }
        .invoice-actions { margin-top: 2rem; display: flex; gap: 1rem; width: 100%; max-width: 500px; }
        .print-btn { flex: 1; padding: .9rem; background: var(--olive); color: #fff; border: none; border-radius: 100px; font-weight: 700; cursor: pointer; }
        .close-invoice { background: none; border: 1px solid var(--border); color: var(--muted); padding: .9rem; border-radius: 100px; cursor: pointer; font-weight: 600; }

        @media (max-width: 400px) {
          .modal-content { padding: 1.75rem 1.25rem 1.5rem; }
          .modal-actions { flex-direction: column; }
          .modal-btn { width: 100%; }
        }
      `}</style>

      {toastMsg && <div className="toast">{toastMsg}</div>}

      <div className="shop-layout">
        {/* ── Catalog column ── */}
        <div className="catalog-col">
          <a className="back-link" onClick={() => navigate('/')}>← Back to Home</a>
          <div className="catalog-header">
            <h2 className="catalog-title">Shop Essentials</h2>
            <div className="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
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
              <p style={{ gridColumn: '1/-1', color: 'var(--muted)', fontSize: '.85rem' }}>No products match your search.</p>
            )}
            {filtered.map(product => {
              const hasUom = product.uom && product.uom.length > 0
              const selectedUomIdx = uomSelections[product.id] ?? 0
              const inCart = !!cart[product.id]

              return (
                <article key={product.id} className="product-card">
                  <div className="img-wrap">
                    <img className="product-img" src={product.image} alt={product.name} loading="lazy" />
                    <span className="cat-badge">{product.category}</span>
                    {product.errand && <span className="errand-badge">🛵 Errand</span>}
                  </div>
                  <div className="product-body">
                    <h3>{product.name}</h3>

                    {hasUom && (
                      <select
                        className="uom-select"
                        value={selectedUomIdx}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          const idx = Number(e.target.value)
                          setUomSelections(prev => ({ ...prev, [product.id]: idx }))
                        }}
                      >
                        {product.uom!.map((opt: UomOption, i: number) => (
                          <option key={opt.label} value={i}>
                            {opt.label} — ₦{opt.price.toLocaleString('en-NG')}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="product-footer">
                      {inCart ? (
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
              )
            })}
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
                  ? <p className="no-saved">No saved lists yet.</p>
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
                          placeholder="List name…"
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
                <p className="empty-state">Your cart is empty.</p>
              ) : (
                <div className="cart-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span>
                          {item.quantity} x {item.uomLabel || 'item'} · ₦{item.total.toLocaleString('en-NG')}
                        </span>
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
                  Name
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
                  Comment
                  <textarea rows={2} placeholder="Do you have a special request on your purchase?" value={errandNote} onChange={e => setErrandNote(e.target.value)} />
                </label>

                <div className="charge-box">
                  <div><span>Shop total</span><strong>₦{shopSubtotal.toLocaleString('en-NG')}</strong></div>
                  <hr className="charge-divider" />
                  <div><span>Errand total</span><strong>₦{errandSubtotal.toLocaleString('en-NG')}</strong></div>
                  
                  <hr className="charge-divider" />
                  <div><span>Subtotal</span><strong>₦{combinedSubtotal.toLocaleString('en-NG')}</strong></div>

                  <hr className="charge-divider" />
                  <div><span>Errand tips</span><strong>₦{errandTips.toLocaleString('en-NG')}</strong></div>
                  <div><span>Delivery fee</span><strong>₦{deliveryFeeNum.toLocaleString('en-NG')}</strong></div>

                  <hr className="charge-divider" />
                  <div className="charge-total-row">
                    <span>Total</span><strong>₦{totalAmount.toLocaleString('en-NG')}</strong>
                  </div>

                  <hr className="charge-divider" />
                  <div><span>Est. time</span><strong>{selectedZoneDetails.eta}</strong></div>

                  <hr className="charge-divider" />
                  <div>
                    <span>50% deposit(shop total)</span><strong>₦{deposit.toLocaleString('en-NG')}</strong>
                  </div>
                </div>

                {!hasSeenErrandPrompt ? (
                  <button
                    type="button"
                    className="submit-btn"
                    disabled={!canSubmit}
                    onClick={() => setShowErrandModal(true)}
                  >
                   View Invoice
                  </button>
                ) : (
                  <button type="submit" className="submit-btn" disabled={!canSubmit}>
                  View Invoice
                  </button>
                )}
              </form>

              {submitted && (
                <div className="success-box" role="status">
                  <strong>Order request ready ✓</strong>
                  <p>We'll confirm via WhatsApp, then collect 50% deposit(shop total) before delivery.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Errand Modal ── */}
      {showErrandModal && (
        <div className="modal-overlay" onClick={() => { setHasSeenErrandPrompt(true); setShowErrandModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🛵</div>
            <h3>Wait, One More Thing!</h3>
            <p>
              Would you like us to run a market errand for you — picking up items we don't currently have in stock — before you checkout?
            </p>
            <div className="modal-divider" />
            <div className="modal-actions">
              <button
                className="modal-btn no"
                onClick={() => { setHasSeenErrandPrompt(true); setShowErrandModal(false); setSubmitted(true); }}
              >
                No, just submit
              </button>
              <button
                className="modal-btn yes"
                onClick={() => navigate('/errand')}
              >
                Yes, go to Errand
              </button>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div className="invoice-overlay">
          <div className="invoice-paper">
            <div className="invoice-header">
              <h1>Daily Basket Foods</h1>
              <p style={{ fontSize: '.8rem', color: 'var(--muted)' }}>Order Summary · {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="invoice-section">
              <h4>Shop Items</h4>
              {cartItems.map(item => (
                <div key={item.id} className="invoice-row">
                  <span>{item.quantity} x {item.name} ({item.uomLabel})</span>
                  <strong>₦{item.total.toLocaleString('en-NG')}</strong>
                </div>
              ))}
            </div>

            {errandItemsForInvoice.length > 0 && (
              <div className="invoice-section">
                <h4>Errand Items</h4>
                {errandItemsForInvoice.map((item, idx) => (
                  <div key={idx} className="invoice-row">
                    <span>{item.quantity} x {item.name} ({item.uomLabel})</span>
                    <strong>₦{item.total.toLocaleString('en-NG')}</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="invoice-section">
              <h4>Summary & Fees</h4>
              <div className="invoice-row"><span>Shop Total</span><strong>₦{shopSubtotal.toLocaleString('en-NG')}</strong></div>
              <div className="invoice-row"><span>Errand Total</span><strong>₦{errandSubtotal.toLocaleString('en-NG')}</strong></div>
              <div className="invoice-row"><span>Errand Tips</span><strong>₦{errandTips.toLocaleString('en-NG')}</strong></div>
              <div className="invoice-row"><span>Delivery Fee</span><strong>₦{deliveryFeeNum.toLocaleString('en-NG')}</strong></div>
              <div className="invoice-row total"><span>Total to Pay</span><strong>₦{totalAmount.toLocaleString('en-NG')}</strong></div>
              
              <div className="invoice-row" style={{ marginTop: '1.2rem', color: 'var(--olive)', fontWeight: 700 }}>
                <span>Payment before delivery</span>
                <strong>₦{(errandSubtotal + errandTips + deposit).toLocaleString('en-NG')}</strong>
              </div>
              <div className="invoice-row" style={{ color: 'var(--olive)', fontWeight: 700 }}>
                <span>On delivery (Balance)</span>
                <strong>₦{(totalAmount - (errandSubtotal + errandTips + deposit)).toLocaleString('en-NG')}</strong>
              </div>

              <div className="calc-breakdown">
                <strong>How we calculated:</strong><br />
                Payment before delivery includes 100% of Errand items (₦{errandSubtotal.toLocaleString()}), Errand tips (₦{errandTips.toLocaleString()}), and a 50% deposit on Shop items & Delivery (₦{deposit.toLocaleString()}). 
                The remaining balance is paid on delivery.
              </div>
            </div>
          </div>
          <div className="invoice-actions">
            <button className="close-invoice" onClick={() => setSubmitted(false)}>Close</button>
            <button className="print-btn" onClick={() => window.print()}>Confirm & Send</button>
          </div>
        </div>
      )}
    </main>
  )
}