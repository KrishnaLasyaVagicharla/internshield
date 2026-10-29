/**
 * Footer Component
 * Syllabus: Exp 4 (Semantic markup & syllabus metadata)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-card)',
        padding: '48px 0 28px',
        marginTop: '60px'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '36px' }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={22} color="#2563eb" />
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>InternShield</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
              The student-first career protection suite. Detecting predatory hiring schemes, auditing ATS resumes, and bridging technical skill gaps.
            </p>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Core Features
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              <li><Link to="/detector">Fake vs Real Detector</Link></li>
              <li><Link to="/resume">Job-Tailored ATS Resume</Link></li>
              <li><Link to="/recommendations">Verified Internships</Link></li>
              <li><Link to="/recruiter-check">Recruiter Blacklist Lookup</Link></li>
              <li><Link to="/skillgap">Role Skill Gap Analyzer</Link></li>
            </ul>
          </div>

          {/* Academic & Syllabus Info */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              FSD Lab Syllabus
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
              Covers Full Stack Development Lab Experiments 1 through 12: Express routing, EJS SSR, React Hooks, Mongoose ODM, and MongoDB Shell pipelines.
            </p>
            <div style={{ marginTop: '10px' }}>
              <a
                href="http://localhost:5000/about"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <BookOpen size={14} /> View EJS SSR Page &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
          <span>&copy; {new Date().getFullYear()} InternShield MERN Project. Designed for FSD Course Viva Examination.</span>
          <span>Express &bull; React &bull; Node.js &bull; MongoDB &bull; EJS</span>
        </div>
      </div>
    </footer>
  );
}
