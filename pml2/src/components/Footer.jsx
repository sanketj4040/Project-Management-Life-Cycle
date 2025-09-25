import React from "react";
function Footer() {
  return (
    <footer className="footer">
      <div style={{ textAlign: 'center' }}>
        <span>&copy; {new Date().getFullYear()} JADE GLOBAL. All Rights Reserved.</span>
        <span style={{ margin: '0 8px' }}>|</span>
        <span>Email Support: <a href="mailto:support@yourcompany.com" style={{ color: '#93c5fd', textDecoration: 'underline' }}>support@yourcompany.com</a></span>
        <span style={{ margin: '0 8px' }}>|</span>
        <span>Mobile Support: <a href="tel:+18001234567" style={{ color: '#93c5fd', textDecoration: 'underline' }}>+1 (800) 123-4567</a></span>
      </div>
    </footer>
  );
}

export default Footer;  