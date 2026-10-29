/**
 * Profile Page Component
 * Syllabus: Exp 4 & 11 (Student Profile Management, Skill Tag Inputs, Controlled React Forms)
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';
import FormInput from '../components/FormInput';
import { User, Plus, Save, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Web Developer');
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [institution, setInstitution] = useState(user?.education?.institution || '');
  const [degree, setDegree] = useState(user?.education?.degree || '');
  const [year, setYear] = useState(user?.education?.graduationYear || 2026);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newSkill.trim() && !skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
        setNewSkill('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await updateProfile({
      name,
      targetRole,
      skills,
      education: {
        institution,
        degree,
        graduationYear: Number(year)
      }
    });

    setSaving(false);
    if (res.success) {
      setMessage('Profile updated successfully! Recommendation and alert matches have been recalculated.');
    }
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.12)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student Profile Settings</h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                Signed in as {user?.email} ({user?.role})
              </p>
            </div>
          </div>

          {message && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid #10b981',
                color: '#34d399',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} /> {message}
            </div>
          )}

          <form onSubmit={handleSave}>
            <FormInput
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Primary Target Role
              </label>
              <select
                className="form-control"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
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

            {/* Education Fields */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>College / University Details</h3>
              <FormInput
                label="Institution Name"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Indian Institute of Information Technology"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                <FormInput
                  label="Degree & Branch"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                />
                <FormInput
                  label="Graduation Year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                />
              </div>
            </div>

            {/* Interactive Skills Tag Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Technical Skills ({skills.length})
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add skill (e.g. Docker, TypeScript, React) & press Enter"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
                <button type="button" onClick={handleAddSkill} className="btn btn-secondary btn-sm">
                  <Plus size={16} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    status="default"
                    onRemove={() => handleRemoveSkill(skill)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
