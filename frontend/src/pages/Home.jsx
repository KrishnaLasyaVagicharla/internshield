/**
 * Home Page Component
 * Syllabus: Exp 4 & 5 (JSX expressions, Event handlers, Conditional rendering, Modern UI styling)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, FileText, CheckCircle, AlertTriangle, ArrowRight, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.25), transparent 70%), var(--color-bg)',
          padding: '80px 0 60px',
          textAlign: 'center',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '24px'
            }}
          >
            <ShieldCheck size={16} /> 100% Student-First Protection Engine
          </div>

          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-1px'
            }}
          >
            Never Fall for a <span style={{ color: '#ef4444' }}>Fake Internship</span> Again.
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--color-muted)',
              lineHeight: 1.6,
              marginBottom: '36px'
            }}
          >
            InternShield inspects suspicious offers, calculates real ATS keyword match against genuine job descriptions, and matches students directly with verified companies.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/detector" className="btn btn-primary btn-lg">
              <Search size={18} /> Detect Fake Internship
            </Link>
            <Link to="/resume" className="btn btn-secondary btn-lg">
              <FileText size={18} /> Build ATS Resume
            </Link>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
              marginTop: '60px',
              padding: '24px',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>0%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Registration Fees Allowed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>150+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Tech Skills Analyzed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>10-min</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Automated Alert Sweeps</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Free Course Links</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Protection Workflow */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
              How InternShield Protects You
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem' }}>
              Three automated layers ensuring college students graduate into legitimate careers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {/* Step 1 */}
            <div
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                1. Inspect Before You Apply
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Paste any job description, WhatsApp message, recruiter email, or stipend offer. Our heuristic engine checks 9 fraud patterns and our active blacklist.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                2. Audit ATS Compatibility
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Paste the company's job description. InternShield extracts required tech keywords, calculates an ATS score, and tailors your resume structure without fabricating facts.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <CheckCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                3. Apply to Vetted Openings
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Only verified corporate employers appear in recommendations. Background cron workers automatically alert you when an opening matches your skill set.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Lab Features Banner */}
      <section
        style={{
          background: 'var(--color-card)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          padding: '60px 0'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              Full Stack Development Viva Demonstration Ready
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
              Every feature satisfies course requirements: Express routing, EJS SSR admin, MongoDB Shell aggregations, React hooks, and session auth.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/recommendations" className="btn btn-primary">
              Explore Verified Openings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
