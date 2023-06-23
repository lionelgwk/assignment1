import "./navbar.css"
import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"

export default function Navbar() {
  const [active, setActive] = useState('navBar');
    return (
      <section>
      <nav className="navigation">
        <a href="/" className="brand-name">
          Marketplace
        </a>
        <button className="hamburger">
          {/* icon from heroicons.com */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          className="navigation-menu">
          <ul>
            <li>
              <NavLink to="/" className="navLink" style={({ isActive }) => { return { color: isActive ? 'white' : '', background: isActive ? '#E58F65' : "", padding: isActive ? "6px" : '', borderRadius: isActive ? "12px" : '', textDecoration: "none" } }}>Home</NavLink>
            </li>
            <li>
              {<NavLink to="/createListing" className="navLink" style={({ isActive }) => { return { color: isActive ? 'white' : '', background: isActive ? '#E58F65' : "", padding: isActive ? "6px" : '', borderRadius: isActive ? "12px" : '', textDecoration: "none" } }}>Create Listing</NavLink>}
            </li>
            <li>
              <NavLink to="/editListing" className="navLink" style={({ isActive }) => { return { color: isActive ? 'white' : '', background: isActive ? '#E58F65' : "", padding: isActive ? "6px" : '', borderRadius: isActive ? "12px" : '', textDecoration: "none" } }}>Edit Listing</NavLink>
            </li>
            <li>
              <NavLink to="/profile" className="navLink" style={({ isActive }) => { return { color: isActive ? 'white' : '', background: isActive ? '#E58F65' : "", padding: isActive ? "6px" : '', borderRadius: isActive ? "12px" : '', textDecoration: "none" } }}>Profile</NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <main>
        <Outlet/>
      </main>
      </section>
    );
  }