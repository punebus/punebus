import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './navbar.css';
import EnquiryForm from "../pages/EnquiryForm";

const ModalPortal = ({ children, onClose }) => {
  const onCloseRef = useRef(onClose);
  const [container] = useState(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-container';
    return { root, wrapper };
  });

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const { root, wrapper } = container;
    root.appendChild(wrapper);

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight || '';
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', onKey);

    return () => {
      try {
        root.removeChild(wrapper);
      } catch {
        // Portal node may already be removed during fast route changes.
      }
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [container]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) onCloseRef.current();
  };

  return ReactDOM.createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true" onMouseDown={handleBackdropClick}>
      <div className="modal-box" tabIndex={-1} role="document">
        <button className="modal-close" aria-label="Close enquiry" onClick={onClose}>✕</button>
        <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>,
    container.wrapper
  );
};

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const adminAppUrl = import.meta.env.VITE_ADMIN_APP_URL || 'http://127.0.0.1:5174';

  // Detect when user scrolls past the hero section (~80% of viewport height)
  useEffect(() => {
    const threshold = window.innerHeight * 0.8;
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((p) => !p);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const openEnquiry = () => {
    setExiting(false);
    setShowEnquiry(true);
    closeMobileMenu();
  };

  const closeEnquiry = () => {
    setExiting(true);
    setTimeout(() => {
      setShowEnquiry(false);
      setExiting(false);
    }, 300);
  };

  const handleEnquirySuccess = () => {
    setExiting(true);
    setTimeout(() => {
      setShowEnquiry(false);
      setExiting(false);
    }, 300);
  };

  useEffect(() => {
    if (showEnquiry) {
      setTimeout(() => {
        const el = document.querySelector('.modal-content input, .modal-content textarea, .modal-content select');
        if (el) el.focus();
      }, 80);
    }
  }, [showEnquiry]);

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="container">

          {/* Brand Text */}
          <div className="brand">
            <Link to="/" onClick={closeMobileMenu} className="brand-link">
              PuneBus
            </Link>
          </div>

          <div
            className={`mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            role="button"
          >
            <span></span><span></span><span></span>
          </div>

          <nav className={`links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={closeMobileMenu} className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/services" onClick={closeMobileMenu} className={isActive('/services') ? 'active' : ''}>Services</Link>
            <Link to="/provider" onClick={closeMobileMenu} className={isActive('/provider') ? 'active' : ''}>Provider</Link>
            <Link to="/partner" onClick={closeMobileMenu} className={isActive('/partner') ? 'active' : ''}>Partner</Link>

            <button
              className="btn-enquiry highlight with-icon"
              onClick={openEnquiry}
              aria-haspopup="dialog"
            >
              Enquiry
            </button>
          </nav>
        </div>
      </header>

      {showEnquiry && (
        <ModalPortal onClose={closeEnquiry}>
          <div className={`enquiry-inner ${exiting ? 'slide-out' : 'slide-in'}`}>
            <EnquiryForm onSuccess={handleEnquirySuccess} />
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export default Navbar;
