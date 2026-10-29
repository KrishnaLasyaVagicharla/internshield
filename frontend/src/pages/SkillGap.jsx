/**
 * Skill Gap Analyzer Page
 * Syllabus: Exp 4, 7, 8 (Dropdown selection, Dynamic Progress bar, Free Learning Resource Cards)
 */
import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import SkillBadge from '../components/SkillBadge';
import Loader from '../components/Loader';
import { Award, BookOpen, ExternalLink, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

export default function SkillGap() {
  const [selectedRole, setSelectedRole] = useState('Web Developer');

  const { data: gapData, loading, error } = useFetch(`/skillgap?role=${encodeURIComponent(selectedRole)}`);

  const {
    role = selectedRole,
    availableRoles = [
      'Web Developer',
      'Data Analyst',
      'Backend Developer',
      'ML Engineer',
      'UI/UX Designer',
      'Android Developer',
      'Cyber Security Analyst',
      'DevOps Engineer'
    ],
    haveSkills = [],
    missingSkills = [],
    readinessPercent = 0,
    courses = []
  } = gapData?.data || {};

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#3b82f6',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}
          >
            <Compass size={15} /> Industry Curriculum Benchmarking
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Role Skill Gap Analyzer
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '6px' }}>
            Compare your registered skill set against verified industry standards and bridge gaps with free accredited courses.
          </p>

          {/* Role Picker */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
              <select
                className="form-control"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{ fontSize: '1rem', fontWeight: 600, padding: '12px 16px' }}
              >
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    Target Role: {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && <Loader text="Auditing skill prerequisites against role matrix..." />}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#f87171', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Readiness Card with Progress Bar */}
            <div
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    Career Readiness Score
                  </span>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
                    {role} Qualification Index
                  </h2>
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: readinessPercent >= 75 ? '#10b981' : (readinessPercent >= 50 ? '#f59e0b' : '#3b82f6'), lineHeight: 1 }}>
                  {readinessPercent}%
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '12px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '24px' }}>
                <div
                  style={{
                    width: `${readinessPercent}%`,
                    height: '100%',
                    background: readinessPercent >= 75 ? '#10b981' : (readinessPercent >= 50 ? '#f59e0b' : '#3b82f6'),
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>

              {/* Two Column Skills Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                {/* Have Skills */}
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <CheckCircle2 size={16} /> Skills You Already Have ({haveSkills.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {haveSkills.length > 0 ? (
                      haveSkills.map((s) => <SkillBadge key={s} skill={s} status="matched" />)
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>No matching skills yet. Add skills in your Profile.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <AlertCircle size={16} /> Skills to Acquire ({missingSkills.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {missingSkills.length > 0 ? (
                      missingSkills.map((s) => <SkillBadge key={s} skill={s} status="missing" />)
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#10b981' }}>Outstanding! You satisfy 100% of industry expectations for this role.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Free Courses Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    Targeted Free Learning Roadmaps
                  </h3>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
                    Directly curated to bridge your missing skills. Zero paywalls.
                  </p>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                  100% Free / Open Access
                </span>
              </div>

              {courses.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
                  {courses.map((course, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                            {course.skill}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                            {course.platform}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', lineHeight: '1.4' }}>
                          {course.title}
                        </h4>
                      </div>

                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}
                      >
                        Start Learning <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--color-muted)' }}>
                  <BookOpen size={36} style={{ marginBottom: '8px' }} />
                  <p>You have already acquired all fundamental prerequisites for this specialization!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
