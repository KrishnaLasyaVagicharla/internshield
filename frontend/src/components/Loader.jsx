/**
 * Loader Component
 * Syllabus: Exp 4 (Conditional rendering of loading states)
 */
import React from 'react';

export default function Loader({ text = 'Loading data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        {text}
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
