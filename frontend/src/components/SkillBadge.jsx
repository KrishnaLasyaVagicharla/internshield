/**
 * SkillBadge Component
 * Syllabus: Exp 4 (Props and conditional rendering for skill match indicators)
 */
import React from 'react';

export default function SkillBadge({ skill, status = 'default', onRemove }) {
  // Status: 'matched' (green), 'missing' (red/amber), 'default' (neutral blue/gray)
  let bg = 'rgba(59, 130, 246, 0.12)';
  let color = '#3b82f6';
  let border = 'rgba(59, 130, 246, 0.3)';

  if (status === 'matched') {
    bg = 'rgba(16, 185, 129, 0.15)';
    color = '#10b981';
    border = 'rgba(16, 185, 129, 0.4)';
  } else if (status === 'missing') {
    bg = 'rgba(239, 68, 68, 0.15)';
    color = '#ef4444';
    border = 'rgba(239, 68, 68, 0.4)';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        fontSize: '0.8rem',
        fontWeight: 600,
        borderRadius: '999px',
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap'
      }}
    >
      {status === 'matched' && <span>&#10003;</span>}
      {status === 'missing' && <span>&#10005;</span>}
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.9rem',
            lineHeight: 1
          }}
          title="Remove skill"
        >
          &times;
        </button>
      )}
    </span>
  );
}
