/**
 * Dashboard Page Component
 * Syllabus: Exp 4, 7, 8 (Dashboard metrics, Context data, useFetch hook integration)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { useFetch } from '../hooks/useFetch';
import SkillBadge from '../components/SkillBadge';
import { ShieldAlert, ShieldCheck, FileText, Bell, Award, ArrowRight, UserCheck } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { unreadCount } = useAlerts();

  // Fetch skill gap readiness for current student's targetRole
  const { data: skillGapData, loading: skillGapLoading } = useFetch(
    `/skillgap?role=${encodeURIComponent(user?.targetRole || 'Web Developer')}`
  );

  const readinessPercent = skillGapData?.data?.readinessPercent || 0;
  const recentScans = user?.recentScans || [];

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.1))',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Student Career Control
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              Welcome back, {user?.name}!
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
              Target Role: <strong>{user?.targetRole || 'Web Developer'}</strong> &bull; {user?.skills?.length || 0} skills registered
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/detector" className="btn btn-primary btn-sm">
              <ShieldAlert size={15} /> Check an Offer
            </Link>
            <Link to="/resume" className="btn btn-secondary btn-sm">
              <FileText size={15} /> Open Resume
            </Link>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Card 1: Target Role Readiness */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)' }}>Role Readiness</span>
              <Award size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
              {skillGapLoading ? '...' : `${readinessPercent}%`}
            </div>
            <div style={{ marginTop: '8px', height: '6px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${readinessPercent}%`, height: '100%', background: '#10b981', transition: 'width 0.5s' }} />
            </div>
            <Link to="/skillgap" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginTop: '12px' }}>
              Analyze Skill Gap &rarr;
            </Link>
          </div>

          {/* Card 2: Unread Alerts */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)' }}>Unread Job Alerts</span>
              <Bell size={18} color="#ef4444" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: unreadCount > 0 ? '#ef4444' : 'var(--color-text)' }}>
              {unreadCount}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '8px' }}>
              Matched verified internships
            </p>
            <Link to="/alerts" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginTop: '12px' }}>
              View Notifications &rarr;
            </Link>
          </div>

          {/* Card 3: Profile Skills Count */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)' }}>Registered Skills</span>
              <UserCheck size={18} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>
              {user?.skills?.length || 0}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '8px' }}>
              Used for matching verified roles
            </p>
            <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginTop: '12px' }}>
              Manage Skills & Profile &rarr;
            </Link>
          </div>

          {/* Card 4: Verified Job Portal */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)' }}>Verified Openings</span>
              <ShieldCheck size={18} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>
              Top Matches
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '8px' }}>
              Filtered by your current skills
            </p>
            <Link to="/recommendations" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginTop: '12px' }}>
              Find Internships &rarr;
            </Link>
          </div>
        </div>

        {/* Two-Column Grid: Registered Skills & Recent Scan History */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          {/* User Skills Preview */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Skill Inventory</h3>
              <Link to="/profile" style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>Edit Skills</Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(user?.skills || []).length > 0 ? (
                user.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} status="default" />
                ))
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                  No skills added yet. Visit Profile to specify your skills.
                </p>
              )}
            </div>
          </div>

          {/* Recent Scans List */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Scam Audits</h3>
              <Link to="/detector" style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>New Scan</Link>
            </div>
            {recentScans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentScans.slice(0, 4).map((scan, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{scan.company}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                        {new Date(scan.scannedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: scan.trustScore >= 70 ? '#10b981' : (scan.trustScore >= 40 ? '#f59e0b' : '#ef4444')
                      }}
                    >
                      {scan.trustScore}/100 &bull; {scan.verdict}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                No recent scans recorded. Use the Scam Detector to audit incoming job offers.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
