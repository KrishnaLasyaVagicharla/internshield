/**
 * NotFound Page Component (404 Fallback)
 * Syllabus: Exp 8 (React Router 404 Route handling)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <ShieldX size={36} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--color-muted)', maxWidth: '440px', margin: '0 auto 28px', lineHeight: '1.6' }}>
        The route you requested does not exist or has been relocated within the InternShield portal.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} /> Return to Homepage
      </Link>
    </div>
  );
}
