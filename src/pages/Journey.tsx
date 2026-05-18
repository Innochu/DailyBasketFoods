export function Journey() {
  return (
    <main className="app-shell">
      <section className="journey-section">
        <div className="section-heading">
          <span className="section-tag">Order journey</span>
          <h2>Keep the process simple for every customer.</h2>
        </div>
        <div className="journey-steps">
          <article>
            <span>1</span>
            <h3>Pick order type</h3>
            <p>Choose Purchase, Errand, or both. No login required.</p>
          </article>
          <article>
            <span>2</span>
            <h3>Add to cart</h3>
            <p>Add products and include an errand note for items you do not sell.</p>
          </article>
          <article>
            <span>3</span>
            <h3>Submit request</h3>
            <p>We review the order and reply with acceptance or rejection plus reason.</p>
          </article>
          <article>
            <span>4</span>
            <h3>Pay 30% first</h3>
            <p>Balance is paid on delivery after your order arrives.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
