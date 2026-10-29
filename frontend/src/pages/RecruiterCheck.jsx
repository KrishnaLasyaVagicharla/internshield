/**
 * Recruiter Email/Phone Checker & Reporting Page
 * Syllabus: Exp 4, 7, 8 (Tabs, Form submission, Blacklist verification, User report management)
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, Flag, CheckCircle2, Phone, Mail, Trash2 } from 'lucide-react';

export default function RecruiterCheck() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Tab: 'check' | 'report' | 'my-reports'
  const [activeTab, setActiveTab] = useState('check');

  // Lookup state
  const [lookupType, setLookupType] = useState('email');
  const [lookupValue, setLookupValue] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [checkError, setCheckError] = useState('');

  // Report filing form state
  const [reportForm, setReportForm] = useState({
    type: 'email',
    value: '',
    reason: ''
  });
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  // My Reports list state
  const [myReports, setMyReports] = useState([]);
  const [loadingMyReports, setLoadingMyReports] = useState(false);

  // Check if prefill was passed from Detector page
  useEffect(() => {
    if (location.state?.prefillValue) {
      setLookupType(location.state.prefillType || 'email');
      setLookupValue(location.state.prefillValue);
      setReportForm({
        type: location.state.prefillType || 'email',
        value: location.state.prefillValue,
        reason: location.state.prefillReason || ''
      });
      // Automatically execute check
      performCheck(location.state.prefillType || 'email', location.state.prefillValue);
    }
  }, [location.state]);

  const performCheck = async (type, val) => {
    if (!val || !val.trim()) {
      setCheckError('Please enter an email or phone number to check.');
      return;
    }
    setChecking(true);
    setCheckError('');
    setCheckResult(null);
    try {
      const res = await api.get(`/reports/check?type=${type}&value=${encodeURIComponent(val.trim())}`);
      if (res.data.success) {
        setCheckResult(res.data.data);
      }
    } catch (err) {
      setCheckError(err.response?.data?.message || 'Verification lookup failed.');
    } finally {
      setChecking(false);
    }
  };

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    performCheck(lookupType, lookupValue);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in as a student to file a fraud report.');
      return;
    }

    setSubmittingReport(true);
    setReportMessage('');
    try {
      const res = await api.post('/reports', reportForm);
      if (res.data.success) {
        setReportMessage('Report submitted successfully! Our moderators will review this entry.');
        setReportForm({ type: 'email', value: '', reason: '' });
        fetchMyReports();
      }
    } catch (err) {
      setReportMessage(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const fetchMyReports = async () => {
    if (!isAuthenticated) return;
    setLoadingMyReports(true);
    try {
      const res = await api.get('/reports/mine');
      if (res.data.success) {
        setMyReports(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch user reports:', err);
    } finally {
      setLoadingMyReports(false);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setMyReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Recruiter Email & Phone Fraud Checker
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '6px' }}>
            Verify recruiter credentials against our crowdsourced fraud registry and detect high-risk communication patterns.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveTab('check')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid var(--color-border)',
              background: activeTab === 'check' ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeTab === 'check' ? '#fff' : 'var(--color-text)',
              cursor: 'pointer'
            }}
          >
            <Search size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Verify Recruiter
          </button>
          <button
            onClick={() => setActiveTab('report')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid var(--color-border)',
              background: activeTab === 'report' ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeTab === 'report' ? '#fff' : 'var(--color-text)',
              cursor: 'pointer'
            }}
          >
            <Flag size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Report a Fraudster
          </button>
          {isAuthenticated && (
            <button
              onClick={() => { setActiveTab('my-reports'); fetchMyReports(); }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '1px solid var(--color-border)',
                background: activeTab === 'my-reports' ? 'var(--color-primary)' : 'var(--color-card)',
                color: activeTab === 'my-reports' ? '#fff' : 'var(--color-text)',
                cursor: 'pointer'
              }}
            >
              My Reports ({myReports.length})
            </button>
          )}
        </div>

        {/* TAB 1: CHECK RECRUITER */}
        {activeTab === 'check' && (
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '32px'
            }}
          >
            {/* Toggle Email vs Phone */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => { setLookupType('email'); setCheckResult(null); }}
                className={`btn btn-sm ${lookupType === 'email' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Mail size={15} /> Check Email
              </button>
              <button
                type="button"
                onClick={() => { setLookupType('phone'); setCheckResult(null); }}
                className={`btn btn-sm ${lookupType === 'phone' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Phone size={15} /> Check Phone / WhatsApp
              </button>
            </div>

            <form onSubmit={handleLookupSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                type={lookupType === 'email' ? 'email' : 'text'}
                className="form-control"
                placeholder={lookupType === 'email' ? 'e.g. hr.careers123@gmail.com' : 'e.g. 9876543210'}
                value={lookupValue}
                onChange={(e) => setLookupValue(e.target.value)}
                required
              />
              <button type="submit" disabled={checking} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                {checking ? 'Checking Registry...' : 'Search Blacklist'}
              </button>
            </form>

            {checkError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                {checkError}
              </div>
            )}

            {/* Verification Result Card */}
            {checkResult && (
              <div
                style={{
                  background: checkResult.reported ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  border: `1px solid ${checkResult.reported ? '#ef4444' : '#10b981'}`,
                  borderRadius: '12px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {checkResult.reported ? (
                      <ShieldAlert size={26} color="#ef4444" />
                    ) : (
                      <ShieldCheck size={26} color="#10b981" />
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                        {checkResult.riskLevel}
                      </h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                        Target: <code>{checkResult.value}</code>
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      background: checkResult.reported ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: checkResult.reported ? '#ef4444' : '#10b981'
                    }}
                  >
                    {checkResult.count} Verified Reports
                  </span>
                </div>

                {/* Pattern warnings */}
                {checkResult.warnings?.length > 0 && (
                  <div style={{ marginBottom: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px' }}>
                    {checkResult.warnings.map((w, idx) => (
                      <div key={idx} style={{ color: '#fbbf24', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={15} /> {w}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reasons if reported */}
                {checkResult.reasons?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#f87171' }}>
                      Reported Scam Reasons on Record:
                    </h4>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {checkResult.reasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REPORT A FRAUDSTER */}
        {activeTab === 'report' && (
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '32px'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              File a Recruiter Scam Report
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Reports enter pending verification. Once verified by our administrators in the EJS moderation dashboard, the entity is added to the global blacklist.
            </p>

            {reportMessage && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.9rem'
                }}
              >
                {reportMessage}
              </div>
            )}

            <form onSubmit={handleReportSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Entity Type
                </label>
                <select
                  className="form-control"
                  value={reportForm.type}
                  onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                >
                  <option value="email">Recruiter Email Address</option>
                  <option value="phone">Phone / WhatsApp Number</option>
                  <option value="company">Company / Organization Name</option>
                </select>
              </div>

              <FormInput
                label="Identifier (Email, Phone, or Company)"
                value={reportForm.value}
                onChange={(e) => setReportForm({ ...reportForm, value: e.target.value })}
                placeholder="e.g. hr.careers123@gmail.com or 9876543210"
                required
              />

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Detailed Reason & Evidence *
                </label>
                <textarea
                  rows="4"
                  className="form-control"
                  value={reportForm.reason}
                  onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                  placeholder="Describe what occurred: Did they ask for a registration fee? What UPI/bank did they request? Provide exact message context..."
                  required
                />
              </div>

              <button type="submit" disabled={submittingReport} className="btn btn-danger" style={{ width: '100%' }}>
                {submittingReport ? 'Submitting to Moderator Queue...' : 'Submit Blacklist Report'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: MY SUBMITTED REPORTS */}
        {activeTab === 'my-reports' && (
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '32px'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
              Your Submitted Fraud Reports
            </h2>

            {loadingMyReports ? (
              <p style={{ color: 'var(--color-muted)' }}>Loading your reports...</p>
            ) : myReports.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {myReports.map((report) => (
                  <div
                    key={report._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>
                          {report.type}
                        </span>
                        <code>{report.value}</code>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: report.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : (report.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                            color: report.status === 'approved' ? '#34d399' : (report.status === 'pending' ? '#fbbf24' : '#f87171')
                          }}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                        {report.reason}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      title="Delete Report"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                You have not filed any reports yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
