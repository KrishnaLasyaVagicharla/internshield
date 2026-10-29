/**
 * FormInput Component
 * Syllabus: Exp 4 & 5 (Standardized Form Control component with Props & Validation State)
 */
import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  ...rest
}) {
  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '6px',
            color: 'var(--color-text)'
          }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-control"
        style={{
          borderColor: error ? '#ef4444' : undefined,
          boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : undefined
        }}
        {...rest}
      />
      {error && (
        <span style={{ display: 'block', fontSize: '0.8rem', color: '#ef4444', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
}
