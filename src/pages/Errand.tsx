import { useState, useMemo, useEffect } from 'react'
import type { FormEvent } from 'react'
import { deliveryZones } from '../data'

import { products } from '../data/products'

const STORAGE_KEY = 'dbf_saved_errand_list'

type SavedList = { name: string; cart: Record<number, number> }

export function Errand() {
  // order mode currently unused in Errand flow; keep as comment for future use
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

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLists)) }, [savedLists])

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2800) }

  const errandOnly = products.filter(p => p.errand)
  const categories = ['All', ...Array.from(new Set(errandOnly.map(p => p.category)))]

  const filtered = useMemo(() => errandOnly.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.note.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [search, activeCategory, errandOnly])

  const addToCart = (id: number) => { setSubmitted(false); setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 })) }
  const removeFromCart = (id: number) => {
    setSubmitted(false)
    setCart(c => {
      const next = (c[id] ?? 0) - 1
      if (next <= 0) { const nextCart = { ...c }; delete nextCart[id]; return nextCart }
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

  const loadList = (list: SavedList) => { setCart(list.cart); showToast(`Loaded "${list.name}"`) }
  const deleteList = (name: string) => { setSavedLists(prev => prev.filter(l => l.name !== name)) }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!canSubmit) return; setSubmitted(true) }

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
        <div className="catalog-col">
          <div className="catalog-header">
            <h2 className="catalog-title">Errand Items</h2>
            <div className="search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="search-input" type="search" placeholder="Search errand items…" value={search} onChange={e => setSearch(e.target.value)} />
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
              <p style={{ gridColumn: '1/-1', color: 'var(--muted)', fontSize: '.9rem' }}>No errand items match your search.</p>
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

        <aside className="sidebar-col">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <h2>Your Errand Order</h2>
              <span className="cart-count-badge">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="sidebar-body">
              <div className="saved-section">
                <div className="saved-label">Saved lists</div>
                {savedLists.length === 0
                  ? <p className="no-saved">No saved lists yet. Save your current errand cart for quick reorder.</p>
                  : (
                    <div className="saved-row">
                      {savedLists.map(list => (
                        <div key={list.name} className="saved-chip" onClick={() => loadList(list)}>
                          📋 {list.name}
                          <button className="del" onClick={e => { e.stopPropagation(); deleteList(list.name) }} title="Remove">×</button>
                        </div>
                      ))}
                    </div>
                  )}

                {cartCount > 0 && (
                  <>
                    <button className="save-toggle" onClick={() => setShowSavePanel(v => !v)}>
                      {showSavePanel ? '↑ Cancel' : '＋ Save this list'}
                    </button>
                    {showSavePanel && (
                      <div className="save-panel">
                        <input className="save-input" placeholder="List name (e.g. Market run)" value={saveListName} onChange={e => setSaveListName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveList()} />
                        <button className="save-confirm" onClick={saveList}>Save</button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {cartItems.length === 0 ? (
                <p className="empty-state">Your errand cart is empty. Add items or load a saved list.</p>
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
                  Errand details (what should we source?)
                  <textarea placeholder="Any special notes for the errand..." value={errandNote} onChange={e => setErrandNote(e.target.value)} />
                </label>

                <div className="charge-box">
                  <div><span>Subtotal</span><strong>₦{subtotal.toLocaleString('en-NG')}</strong></div>
                  <div><span>Estimated deposit (30%)</span><strong>₦{deposit.toLocaleString('en-NG')}</strong></div>
                  <div><span>Delivery</span><strong>{selectedZoneDetails.fee}</strong></div>
                </div>

                <button type="submit" className="submit-btn" disabled={!canSubmit}>Place Errand Order</button>

                {submitted && (
                  <div className="success-box">
                    <strong>Thanks — errand order received</strong>
                    <p>We will confirm availability and final pricing via WhatsApp shortly.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
