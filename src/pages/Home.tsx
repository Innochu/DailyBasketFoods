import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { OrderMode } from '../data'
import { orderModes } from '../data'

const brandPromises = ['Purchase Food items', 'Send Errand', 'Stay Healthy always']

export function Home() {
  const [selectedMode, setSelectedMode] = useState<OrderMode>('purchase')

  return (
    <main className="app-shell">
      <style>{`
        /* ── Reset & tokens ───────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream:   #f5f2eb;
          --olive:   #4a5e2f;
          --olive-dk:#3a4a22;
          --tan:     #c8b97a;
          --brown:   #2d2416;
          --muted:   #7a7060;
          --card-bg: #ffffff;
          --radius:  18px;
          --shadow:  0 4px 24px rgba(45,36,22,.10);
          --transition: .25s cubic-bezier(.4,0,.2,1);
        }

        /* ── Shell ────────────────────────────────────── */
        .app-shell {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'Georgia', 'Times New Roman', serif;
          color: var(--brown);
        }

        /* ── Hero ─────────────────────────────────────── */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: clamp(2rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem);
          max-width: 1280px;
          margin: 0 auto;
          min-height: 90vh;
          align-items: center;
        }

        /* copy side */
        .hero-copy {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .eyebrow {
          font-family: 'Courier New', monospace;
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--olive);
        }

        .hero-copy h2 {
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          line-height: 1.12;
          font-weight: 800;
          color: var(--brown);
          letter-spacing: -.02em;
        }

        .hero-text {
          font-size: 1rem;
          color: var(--muted);
          line-height: 1.6;
          font-family: 'Courier New', monospace;
        }

        .promise-row {
          display: flex;
          flex-wrap: wrap;
          gap: .6rem;
        }

        .promise-row span {
          background: #ede8dc;
          border: 1.5px solid #d4cbb8;
          border-radius: 100px;
          padding: .4rem 1rem;
          font-size: .85rem;
          color: var(--brown);
          font-family: 'Courier New', monospace;
          letter-spacing: .02em;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: .75rem;
          margin-top: .5rem;
        }

        .primary-link {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          background: var(--olive);
          color: #fff;
          padding: .75rem 1.75rem;
          border-radius: 100px;
          text-decoration: none;
          font-size: .95rem;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          letter-spacing: .04em;
          transition: background var(--transition), transform var(--transition);
        }
        .primary-link:hover {
          background: var(--olive-dk);
          transform: translateY(-2px);
        }

        /* ── Hero image card ─────────────────────────── */
        .hero-image-card {
          position: relative;
          border-radius: var(--radius);
          overflow: hidden;
          aspect-ratio: 4/5;
          box-shadow: 0 12px 48px rgba(45,36,22,.18);
        }

        .hero-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .6s ease;
        }

        .hero-image-card:hover img {
          transform: scale(1.04);
        }

        /* overlay badge */
        .image-badge {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          background: rgba(255,255,255,.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: .9rem 1.2rem;
          display: flex;
          align-items: center;
          gap: .75rem;
          box-shadow: 0 4px 16px rgba(45,36,22,.14);
        }

        .badge-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--olive);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .7rem;
          font-weight: 900;
          font-family: 'Courier New', monospace;
          letter-spacing: .06em;
          flex-shrink: 0;
        }

        .badge-text strong {
          display: block;
          font-size: .85rem;
          font-weight: 700;
          color: var(--brown);
        }

        .badge-text span {
          font-size: .72rem;
          color: var(--muted);
          font-family: 'Courier New', monospace;
        }

        /* freshness tag top-right */
        .freshness-tag {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: var(--olive);
          color: #fff;
          border-radius: 100px;
          padding: .35rem .85rem;
          font-size: .72rem;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        /* ── Mode section ─────────────────────────────── */
        .mode-section {
          padding: clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem);
          max-width: 1280px;
          margin: 0 auto;
        }

        .section-heading {
          margin-bottom: 2rem;
        }

        .section-tag {
          font-family: 'Courier New', monospace;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--olive);
          display: block;
          margin-bottom: .5rem;
        }

        .section-heading h2 {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--brown);
        }

        .mode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .mode-card {
          background: var(--card-bg);
          border: 2px solid transparent;
          border-radius: var(--radius);
          padding: 1.5rem;
          text-align: left;
          cursor: pointer;
          transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          gap: .5rem;
        }

        .mode-card:hover {
          border-color: var(--tan);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(45,36,22,.14);
        }

        .mode-card.active {
          border-color: var(--olive);
          background: #f0f5e8;
        }

        .mode-card strong {
          font-size: 1rem;
          color: var(--brown);
          font-weight: 700;
        }

        .mode-card span {
          font-size: .85rem;
          color: var(--muted);
          line-height: 1.5;
          font-family: 'Courier New', monospace;
        }

        /* ── Responsive ─────────────────────────────── */
        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
            min-height: auto;
            gap: 2.5rem;
          }

          .hero-image-card {
            aspect-ratio: 16/9;
            max-height: 380px;
          }

          .hero-copy h2 {
            font-size: clamp(1.75rem, 6vw, 2.5rem);
          }
        }

        @media (max-width: 560px) {
          .hero-section {
            padding: 1.5rem 1rem;
          }

          .mode-section {
            padding: 2rem 1rem;
          }

          .hero-image-card {
            aspect-ratio: 4/3;
          }

          .mode-grid {
            grid-template-columns: 1fr;
          }

          .image-badge {
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Daily Basket Foods</span>
          <h2>Simple food ordering for everyday customers.</h2>
          <div className="promise-row" aria-label="Brand promise">
            {brandPromises.map((promise) => (
              <span key={promise}>{promise}</span>
            ))}
          </div>

          <div className="hero-actions">
            <Link to="/shop" className="primary-link">
              Start order →
            </Link>
          </div>
        </div>

        {/* Catchy food image replacing brand card */}
        <div className="hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80"
            alt="A vibrant spread of fresh local Nigerian food ingredients — rice, peppers, beans, spices"
            loading="eager"
          />
          <span className="freshness-tag">🌿 Farm Fresh</span>
          <div className="image-badge">
            <div className="badge-icon">DBF</div>
            <div className="badge-text">
              <strong>Daily Basket Foods</strong>
              <span>Fresh · Hygienic · Locally Sourced</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Order modes ── */}
      <section className="mode-section">
        <div className="section-heading">
          <span className="section-tag">How ordering works</span>
          <h2>Choose the kind of order you want to place.</h2>
        </div>

        <div className="mode-grid">
          {orderModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`mode-card ${selectedMode === mode.id ? 'active' : ''}`}
              onClick={() => setSelectedMode(mode.id)}
            >
              <strong>{mode.title}</strong>
              <span>{mode.description}</span>
            </button>
          ))}
        </div>

        <Link
          to="/shop"
          className="primary-link"
          style={{ marginTop: '2rem', display: 'inline-flex' }}
        >
          Continue to Shop →
        </Link>
      </section>
    </main>
  )
}