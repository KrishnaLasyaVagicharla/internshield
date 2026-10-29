/**
 * AlertBell Component
 * Syllabus: Exp 7 (Consuming lifted context state to update visual indicators across pages)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';

export default function AlertBell() {
  const { unreadCount } = useAlerts();

  return (
    <Link
      to="/alerts"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '8px',
        color: 'var(--color-text)',
        background: 'transparent',
        transition: 'background 0.2s'
      }}
      title={`${unreadCount} Unread Alerts`}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#ef4444',
            color: '#ffffff',
            borderRadius: '999px',
            padding: '2px 5px',
            fontSize: '0.65rem',
            fontWeight: 800,
            lineHeight: 1,
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
