/**
 * Register Page Component
 * Syllabus: Exp 4 & 11 (Controlled Form components, client-side validation, Express Session creation)
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    skills: 'React, JavaScript, HTML, CSS, Git',
    targetRole: 'Web Developer'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      targetRole: formData.targetRole
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
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
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <UserPlus size={22} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Create Student Account</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Access scam verification, ATS resume builder & alerts
            </p>
          </div>

          {/* Error Banner */}
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
              id="name"
              name="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Aarav Sharma"
              required
            />

            <FormInput
              id="email"
              name="email"
              label="Student Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. student@college.edu"
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars"
                required
              />
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retype password"
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="targetRole"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '6px',
                  color: 'var(--color-text)'
                }}
              >
                Target Career Role
              </label>
              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Web Developer">Web Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="ML Engineer">ML Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Android Developer">Android Developer</option>
                <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            <FormInput
              id="skills"
              name="skills"
              label="Your Skills (Comma separated)"
              type="text"
              value={formData.skills}
              onChange={handleChange}
              placeholder="HTML, CSS, JavaScript, React"
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {submitting ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </form>

          {/* Login prompt */}
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Sign in &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
