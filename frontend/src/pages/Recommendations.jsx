/**
 * Verified Recommendations Page Component
 * Syllabus: Exp 4, 7, 8 (useDebounce, useMemo, Filter Bar, Match Percentage Visualization)
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';
import InternshipCard from '../components/InternshipCard';
import Loader from '../components/Loader';
import { ShieldCheck, Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Recommendations() {
  const { data: recData, loading, error, refetch } = useFetch('/recommend');

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('all');
  const [minStipend, setMinStipend] = useState(0);

  // Debounced search query (Exp 7 Performance optimization)
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter recommendations in memory using useMemo
  const filteredListings = useMemo(() => {
    if (!recData?.data) return [];

    return recData.data.filter((item) => {
      // 1. Text filter
      const matchesSearch =
        debouncedSearch === '' ||
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.requiredSkills.some((s) => s.toLowerCase().includes(debouncedSearch.toLowerCase()));

      // 2. Mode filter
      const matchesMode = selectedMode === 'all' || item.mode === selectedMode;

      // 3. Stipend filter
      const matchesStipend = (item.stipend || 0) >= minStipend;

      return matchesSearch && matchesMode && matchesStipend;
    });
  }, [recData, debouncedSearch, selectedMode, minStipend]);

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center', maxWidth: '760px', margin: '0 auto 32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}
          >
            <ShieldCheck size={16} /> Only 100% Verified Corporate Openings
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Personalized Internship Recommendations
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '6px' }}>
            Ranked by match percentage against your registered skills. Zero fake or unverified listings.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '38px' }}
              placeholder="Search title, company, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Mode Selector */}
          <div>
            <select
              className="form-control"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              <option value="all">All Working Modes</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-Site</option>
            </select>
          </div>

          {/* Min Stipend Filter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--color-muted)' }}>
              <span>Min Stipend:</span>
              <span style={{ color: 'var(--color-text)' }}>₹{minStipend.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="5000"
              value={minStipend}
              onChange={(e) => setMinStipend(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && <Loader text="Calculating skill matches against verified directory..." />}

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#f87171',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <p style={{ fontWeight: 600 }}>{error}</p>
            <button onClick={refetch} className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
              Retry
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
          <>
            {filteredListings.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '24px'
                }}
              >
                {filteredListings.map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    matchPercent={internship.matchPercent}
                    matchedSkills={internship.matchedSkills}
                    missingSkills={internship.missingSkills}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '60px 20px',
                  textAlign: 'center'
                }}
              >
                <SlidersHorizontal size={40} style={{ color: 'var(--color-muted)', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>No matches with current filters</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Try lowering your minimum stipend or clearing the keyword search.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedMode('all'); setMinStipend(0); }}
                  className="btn btn-secondary btn-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
