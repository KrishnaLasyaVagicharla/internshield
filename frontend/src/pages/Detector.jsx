/**
 * Fake vs Real Internship Detector Page
 * Syllabus: Exp 4, 5, 8 (Form Controls, TrustMeter integration, API interaction, Error Boundary)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TrustMeter from '../components/TrustMeter';
import FormInput from '../components/FormInput';
import ErrorBoundary from '../components/ErrorBoundary';
import { ShieldAlert, AlertOctagon, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Flag } from 'lucide-react';

export default function Detector() {
  const [formData, setFormData] = useState({
    text: '',
    company: '',
    recruiterEmail: '',
    recruiterPhone: '',
    link: '',
    stipend: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!formData.text && !formData.company && !formData.recruiterEmail && !formData.recruiterPhone && !formData.link) {
      setError('Please provide at least a job description, email, phone, or link to inspect.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/detector/analyze', formData);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze listing.');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset samples for evaluator viva testing
  const loadSample = (type) => {
    if (type === 'fake') {
      setFormData({
        text: 'Work from home 2 hours daily! Freshers can earn Rs 65,000 per month without any prior coding experience or degree. Pay refundable security deposit of Rs 1,499 for system configuration setup. Apply within 24 hours, limited seats remaining. Contact WhatsApp only at 9876543210 immediately.',
        company: 'Apex Global Solutions Ltd',
        recruiterEmail: 'hr.careers123@gmail.com',
        recruiterPhone: '9876543210',
        link: 'https://bit.ly/apex-instant-intern',
        stipend: '65000'
      });
    } else {
      setFormData({
        text: 'Join our merchant checkout team to build responsive, accessible web interfaces in React and TypeScript. Collaborate with senior designers and backend engineers in our Bengaluru office.',
        company: 'Razorpay Software',
        recruiterEmail: 'campus-hiring@razorpay.com',
        recruiterPhone: '08046669999',
        link: 'https://razorpay.com/jobs/frontend-intern',
        stipend: '35000'
      });
    }
    setResult(null);
  };

  const handleReportRedirect = () => {
    navigate('/recruiter-check', {
      state: {
        prefillType: formData.recruiterEmail ? 'email' : 'phone',
        prefillValue: formData.recruiterEmail || formData.recruiterPhone || formData.company,
        prefillReason: result?.flags?.map(f => f.explanation).join('. ') || 'Suspicious demands detected in scan'
      }
    });
  };

  return (
    <ErrorBoundary>
      <div style={{ padding: '40px 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ maxWidth: '800px', margin: '0 auto 36px', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '12px'
              }}
            >
              <ShieldAlert size={15} /> Fraud Prevention Rule Engine
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
              Fake vs Real Internship Detector
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', marginTop: '8px' }}>
              Inspect job descriptions, recruiter emails, deposit requests, and shortlinks to generate a Trust Score (0-100).
            </p>

            {/* Viva preset sample buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => loadSample('fake')}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} /> Load Scam Preset (Viva Test)
              </button>
              <button
                type="button"
                onClick={() => loadSample('real')}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} /> Load Verified Real Preset
              </button>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: result ? '1.2fr 1fr' : '1fr', gap: '32px', maxWidth: result ? '1180px' : '720px', margin: '0 auto' }}>
            {/* Form Column */}
            <div
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
                Listing & Offer Information
              </h2>

              {error && (
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
                  {error}
                </div>
              )}

              <form onSubmit={handleAnalyze}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="text"
                    style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}
                  >
                    Job Description, Message, or Email Body
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    rows="5"
                    className="form-control"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Paste the WhatsApp text, internship offer letter, or portal description..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <FormInput
                    id="company"
                    name="company"
                    label="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Apex Global Solutions"
                  />
                  <FormInput
                    id="stipend"
                    name="stipend"
                    label="Offered Stipend (₹)"
                    type="number"
                    value={formData.stipend}
                    onChange={handleChange}
                    placeholder="e.g. 65000"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <FormInput
                    id="recruiterEmail"
                    name="recruiterEmail"
                    label="Recruiter Email"
                    type="email"
                    value={formData.recruiterEmail}
                    onChange={handleChange}
                    placeholder="e.g. hr.careers123@gmail.com"
                  />
                  <FormInput
                    id="recruiterPhone"
                    name="recruiterPhone"
                    label="Recruiter Phone / WhatsApp"
                    value={formData.recruiterPhone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <FormInput
                  id="link"
                  name="link"
                  label="Application / Registration URL"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="e.g. https://bit.ly/... or .xyz link"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {loading ? 'Executing Heuristic Audit...' : 'Analyze Trustworthiness'}
                </button>
              </form>
            </div>

            {/* Results Column */}
            {result && (
              <div
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                {/* Animated Circular Trust Meter */}
                <TrustMeter score={result.trustScore} />

                {/* Flags breakdown */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} color="#ef4444" />
                    Detected Risk Factors ({result.flags.length})
                  </h3>

                  {result.flags.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {result.flags.map((flag, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(239, 68, 68, 0.08)',
                            borderLeft: '4px solid #ef4444',
                            padding: '12px 16px',
                            borderRadius: '4px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>{flag.rule}</strong>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171' }}>-{flag.penalty} pts</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: '1.4' }}>
                            {flag.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderLeft: '4px solid #10b981',
                        padding: '12px 16px',
                        borderRadius: '4px',
                        color: '#34d399',
                        fontSize: '0.85rem'
                      }}
                    >
                      No scam flags detected! The listing uses standard professional recruitment practices.
                    </div>
                  )}
                </div>

                {/* Safety Tips */}
                {result.tips.length > 0 && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#60a5fa' }}>
                      Student Action Recommendations:
                    </h4>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {result.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Report recruiter CTA */}
                {result.trustScore < 70 && (
                  <button
                    type="button"
                    onClick={handleReportRedirect}
                    className="btn btn-danger"
                    style={{ width: '100%' }}
                  >
                    <Flag size={16} /> Report This Recruiter to Fraud Registry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
