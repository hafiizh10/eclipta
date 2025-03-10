import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { isAuthenticated } from '../utils/authService';
import useAboutData from '../hooks/useAboutData';

const Navbar: React.FC = () => {
  const location = useLocation();
  const auth = isAuthenticated();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const { about, error } = useAboutData(); // Destructure the hook's return value
  const navbarToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = () => {
    // Cek apakah navbar dalam keadaan expanded (di perangkat mobile)
    const navbarCollapse = document.getElementById('basic-navbar-nav');
    if (navbarCollapse?.classList.contains('show')) {
      // Klik tombol toggle untuk menutup navbar
      navbarToggleRef.current?.click();
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <BootstrapNavbar 
      bg={scrolled ? (darkMode ? 'dark' : 'white') : (darkMode ? 'dark' : 'light')} 
      expand="lg" 
      className={`py-3 ${scrolled ? 'shadow-sm navbar-scrolled' : ''} transition-all duration-300`}
      sticky="top"
      variant={darkMode ? 'dark' : 'light'}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <span className={darkMode ? 'text-light' : 'text-primary'}>{about?.shortName}</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" ref={navbarToggleRef} />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto py-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/portfolio', label: 'Portfolio' },
              { path: '/blog', label: 'Blog' },
              { path: '/licenses', label: 'Licenses' }
            ].map((item) => (
              <Nav.Link 
                key={item.path}
                as={Link} 
                to={item.path} 
                active={location.pathname === item.path || location.pathname.startsWith(item.path !== '/' ? item.path : null)}
                className={`mx-1 px-3 nav-link ${location.pathname === item.path || location.pathname.startsWith(item.path !== '/' ? item.path : null) ? 'active rounded-pill bg-primary bg-opacity-10 text-primary fw-bold' : (darkMode ? 'text-light hover-lift' : 'text-dark hover-lift')}`}
                onClick={handleNavLinkClick}
              >
                {item.label}
              </Nav.Link>
            ))}
            
            {auth ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/admin" 
                  active={location.pathname.startsWith('/admin')}
                  className={`mx-1 px-3 nav-link ${location.pathname.startsWith('/admin') ? 'active rounded-pill bg-primary bg-opacity-10 text-primary fw-bold' : (darkMode ? 'text-light hover-lift' : 'text-dark hover-lift')}`}
                  onClick={handleNavLinkClick}
                >
                  Admin
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/logout"
                  className={`mx-1 px-3 nav-link ${darkMode ? 'text-light hover-lift' : 'text-dark hover-lift'}`}
                  onClick={handleNavLinkClick}
                >
                  Logout
                </Nav.Link>
              </>
            ) : ''}
          </Nav>
          <Button 
            variant={darkMode ? 'light' : 'dark'} 
            onClick={() => setDarkMode(!darkMode)}
            className="ms-3 rounded-circle"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {darkMode ? '☀️' : '🌙'}
          </Button>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;