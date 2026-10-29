/**
 * Navbar Component
 * Syllabus: Exp 4 & 7 (Conditional rendering based on Auth state, Theme Toggle, AlertBell integration)
 */
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AlertBell from './AlertBell';
import { ShieldCheck, Moon, Sun, Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        backgroundColor: 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563eb', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
              Intern<span style={{ color: '#3b82f6' }}>Shield</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <NavLink to="/" className={navItemClass}>Home</NavLink>
          <NavLink to="/detector" className={navItemClass}>Scam Detector</NavLink>
          <NavLink to="/resume" className={navItemClass}>Resume ATS</NavLink>
          <NavLink to="/recommendations" className={navItemClass}>Verified Jobs</NavLink>
          <NavLink to="/recruiter-check" className={navItemClass}>Recruiter Check</NavLink>
          <NavLink to="/skillgap" className={navItemClass}>Skill Gap</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navItemClass}>Dashboard</NavLink>
          )}
        </nav>

        {/* Right Action Icons & Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--color-text)',
              cursor: 'pointer',
              display: 'flex'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Alert Bell for Authenticated Users */}
          {isAuthenticated && <AlertBell />}

          {/* Admin Panel Link */}
          {isAdmin && (
            <a
              href="http://localhost:5000/admin"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Open EJS Admin Panel"
            >
              <Shield size={13} /> Admin Panel
            </a>
          )}

          {/* Auth State CTAs */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--color-text)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                style={{ padding: '6px 10px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text)',
              display: 'none',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            background: 'var(--color-card)',
            borderBottom: '1px solid var(--color-border)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}
        >
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Home</NavLink>
          <NavLink to="/detector" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Scam Detector</NavLink>
          <NavLink to="/resume" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Resume ATS</NavLink>
          <NavLink to="/recommendations" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Verified Jobs</NavLink>
          <NavLink to="/recruiter-check" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Recruiter Check</NavLink>
          <NavLink to="/skillgap" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Skill Gap</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Dashboard</NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={navItemClass}>Profile Settings</NavLink>
            </>
          )}
        </div>
      )}

      <style>{`
        .nav-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-muted);
          transition: color 0.2s;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--color-primary);
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
