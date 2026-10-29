/**
 * TrustMeter Component
 * Syllabus: Exp 4 & 5 (SVG rendering, Props, State, Nesting Class Component inside Function Component)
 */
import React from 'react';
import ClassTrustMeter from './ClassTrustMeter';

export default function TrustMeter({ score = 100, size = 160, showClassDemo = true }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = '#10b981'; // Green
  let verdictText = 'Likely Real';
  if (score < 40) {
    color = '#ef4444'; // Red
    verdictText = 'Likely Fake';
  } else if (score < 70) {
    color = '#f59e0b'; // Amber
    verdictText = 'Suspicious';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease' }}
          />
        </svg>

        {/* Center score readout */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: size * 0.22, fontWeight: 800, color: color, lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)', marginTop: '4px' }}>
            TRUST SCORE
          </span>
        </div>
      </div>

      <div
        style={{
          background: `${color}18`,
          color: color,
          border: `1px solid ${color}40`,
          borderRadius: '999px',
          padding: '4px 16px',
          fontSize: '0.9rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {verdictText}
      </div>

      {/* Nesting ClassTrustMeter to prove Function & Class component interoperability (Syllabus Exp 5) */}
      {showClassDemo && (
        <div style={{ marginTop: '8px' }}>
          <ClassTrustMeter score={score} label="Class Component Sync" />
        </div>
      )}
    </div>
  );
}
