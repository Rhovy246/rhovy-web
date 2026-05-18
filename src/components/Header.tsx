import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import imgLogo from '../assets/images/rhovy.png';

interface HeaderProps {
  currentPage: 'dashboard' | 'get-rho';
  onSignOut: () => void;
}

export default function Header({ currentPage, onSignOut }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSignOut = () => {
    setMenuOpen(false);
    onSignOut();
  };

  const handleNav = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <>
      <header className="bg-white border-b border-[#ececef] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-5 flex items-center justify-between">
          <Link to="/"><img src={imgLogo} alt="Rhovy" className="h-6 w-auto" /></Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3.5">
            {currentPage === 'dashboard' ? (
              <span className="label-mono text-[#171419]">Dashboard</span>
            ) : (
              <Link to="/" className="label-mono text-[#8b858f] hover:text-[#171419] transition-colors">
                Dashboard
              </Link>
            )}
            <div className="w-px h-4 bg-[#ececef]" />
            {currentPage === 'get-rho' ? (
              <span className="label-mono text-[#171419]">Get RHO</span>
            ) : (
              <Link to="/submit-receipt" className="label-mono text-[#8b858f] hover:text-[#171419] transition-colors">
                Get RHO
              </Link>
            )}
            <div className="w-px h-4 bg-[#ececef]" />
            <button
              onClick={onSignOut}
              className="label-mono text-[#8b858f] hover:text-[#171419] transition-colors bg-transparent border-0 cursor-pointer p-0"
            >
              Sign out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="sm:hidden bg-transparent border-0 cursor-pointer p-1 text-[#171419]"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(2px)',
            animation: 'rhovy-fade-in 0.2s ease-out',
          }}
        >
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '80%', maxWidth: '320px',
              background: '#ffffff',
              display: 'flex', flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
              animation: 'rhovy-slide-in 0.25s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderBottom: '1px solid #ececef',
            }}>
              {user?.email ? (
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
                    fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: '#8b858f', lineHeight: 1.4,
                  }}>
                    Signed in
                  </div>
                  <div style={{
                    fontSize: '12px', color: '#171419', marginTop: '2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user.email}
                  </div>
                </div>
              ) : <div />}
              <button
                onClick={() => setMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b858f', padding: '4px', flexShrink: 0, marginLeft: '8px' }}
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer nav items */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => handleNav('/')}
                style={{
                  display: 'block', width: '100%', padding: '15px 18px',
                  border: 'none', borderBottom: '1px solid #ececef',
                  background: 'none', textAlign: 'left', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 500,
                  color: currentPage === 'dashboard' ? '#171419' : '#5a555f',
                  fontFamily: 'inherit',
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('/submit-receipt')}
                style={{
                  display: 'block', width: '100%', padding: '15px 18px',
                  border: 'none', borderBottom: '1px solid #ececef',
                  background: 'none', textAlign: 'left', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 500,
                  color: currentPage === 'get-rho' ? '#171419' : '#5a555f',
                  fontFamily: 'inherit',
                }}
              >
                Get RHO
              </button>
              <button
                onClick={handleSignOut}
                style={{
                  display: 'block', width: '100%', padding: '15px 18px',
                  border: 'none', background: 'none', textAlign: 'left',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                  color: '#5a555f', fontFamily: 'inherit',
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
