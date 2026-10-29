/**
 * InternshipCard Component
 * Syllabus: Exp 4 & 5 (Reusable Props, Conditional Rendering, Events onMouseEnter/Leave)
 */
import React, { useState } from 'react';
import SkillBadge from './SkillBadge';
import { ShieldCheck, ShieldAlert, MapPin, Banknote, Laptop, ExternalLink } from 'lucide-react';

export default function InternshipCard({
  internship,
  matchPercent,
  matchedSkills = [],
  missingSkills = []
}) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    title,
    company,
    description,
    location,
    stipend,
    mode,
    applyLink,
    verified,
    trustScore,
    requiredSkills = []
  } = internship;

  const trustColor = trustScore >= 70 ? '#10b981' : (trustScore >= 40 ? '#f59e0b' : '#ef4444');

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--color-card)',
        border: `1px solid ${isHovered ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 12px 24px -10px rgba(0,0,0,0.3)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative'
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-muted)' }}>
              {company}
            </span>
            {verified ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                <ShieldCheck size={13} /> Verified Real
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                <ShieldAlert size={13} /> Unverified
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>
            {title}
          </h3>
        </div>

        {/* Match % / Trust Score Badge */}
        <div style={{ textAlign: 'right' }}>
          {matchPercent !== undefined ? (
            <div
              style={{
                background: matchPercent >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: matchPercent >= 75 ? '#10b981' : '#3b82f6',
                border: `1px solid ${matchPercent >= 75 ? '#10b981' : '#3b82f6'}`,
                padding: '4px 12px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '1rem'
              }}
            >
              {matchPercent}% Match
            </div>
          ) : (
            <div
              style={{
                border: `1px solid ${trustColor}`,
                color: trustColor,
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              Trust {trustScore}/100
            </div>
          )}
        </div>
      </div>

      {/* Meta tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={15} /> {location || 'Remote'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Laptop size={15} /> <span style={{ textTransform: 'capitalize' }}>{mode}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Banknote size={15} /> {stipend ? `₹${stipend.toLocaleString()}/month` : 'Unpaid'}
        </span>
      </div>

      {/* Description Snippet */}
      <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>
        {description.length > 150 ? `${description.slice(0, 150)}...` : description}
      </p>

      {/* Required / Matched Skills List */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px' }}>
          Required Skills:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {requiredSkills.map((skill) => {
            const isMatched = matchedSkills.includes(skill);
            const isMissing = missingSkills.includes(skill);
            const status = isMatched ? 'matched' : (isMissing ? 'missing' : 'default');
            return <SkillBadge key={skill} skill={skill} status={status} />;
          })}
        </div>
      </div>

      {/* Card Footer: Apply Link */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
        {applyLink ? (
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Apply Directly <ExternalLink size={14} />
          </a>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Direct application on portal</span>
        )}
      </div>
    </div>
  );
}
