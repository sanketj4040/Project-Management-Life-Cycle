import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <img src="/images/logo.png" alt="Logo" className="logo" />
      <div className="header-text">
        <h1>Task Board</h1>
        <p>Welcome to your project management portal</p>
      </div>
      <nav className="main-nav">
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/services" className="nav-link">Services</Link></li>
          <li><Link to="/help" className="nav-link">Help</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
