import { Link } from 'react-router-dom'
import '../App.css'

export function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="brand-mark">DBF</span>
          Daily Basket Foods
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/journey">How it Works</Link>
          </li>
          <li>
            <Link to="/standards">Standards</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
