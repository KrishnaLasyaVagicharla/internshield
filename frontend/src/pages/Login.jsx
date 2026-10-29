/**
 * Login Page Component
 * Syllabus: Exp 4 & 11 (Controlled form components, useState, session-based authentication)
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import { ShieldCheck, LogIn, Key, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setFormError(result.message || 'Authentication failed. Please verify credentials.');
    }
  };

  // Quick fill demo credentials for viva examiner
  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormError('');
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(37, 99, 235, 0.12)',
                color: '#2563eb',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <LogIn size={22} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Sign in to manage your scans, alerts & resume
            </p>
          </div>

          {/* Error Message Banner */}
          {formError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid #ef4444',
                color: '#f87171',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '20px'
              }}
            >
              {formError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aarav.sharma@college.edu"
              required
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {submitting ? 'Verifying Session...' : 'Sign In to InternShield'}
            </button>
          </form>

          {/* Quick Viva Demo Auto-fill Helper */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--color-border)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Sparkles size={12} /> Viva Evaluator Quick Logins:
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => fillCredentials('aarav.sharma@college.edu', 'Student@123')}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@internshield.com', 'Admin@123')}
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Admin Demo
              </button>
            </div>
          </div>

          {/* Register Prompt */}
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '20px' }}>
            New to InternShield?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Create student account &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
