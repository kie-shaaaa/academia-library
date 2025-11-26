import { useState } from 'react';
import BookLogo from './BookLogo';

interface NavbarProps {
  brandName: string;
  onHomeClick?: () => void;
}

function Navbar({ brandName, onHomeClick }: NavbarProps) {
  const navLinkStyle: React.CSSProperties = {
    color: '#fff',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light shadow" style={{ backgroundColor: '#660B05' }}>
      <div className="container-fluid">
        <a 
          className="navbar-brand d-flex align-items-center ms-3" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onHomeClick) onHomeClick();
          }}
          style={{ cursor: 'pointer' }}
        >
          <BookLogo color="#FFF0C4" size={30} className="me-2" />
          <span className="fw-bolder fs-4 text-white">{brandName}</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-md-0">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                style={navLinkStyle}
                onClick={(e) => {
                  e.preventDefault();
                  if (onHomeClick) onHomeClick();
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD700')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
              >
                Home
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
