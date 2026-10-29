/**
 * ResumeBuilder Page Component
 * Syllabus: Exp 4, 7, 8 (useReducer form state management, dynamic arrays add/remove, ATS matching, Print CSS)
 */
import React, { useReducer, useState } from 'react';
import api from '../api/axios';
import SkillBadge from '../components/SkillBadge';
import FormInput from '../components/FormInput';
import { FileText, Printer, Sparkles, CheckCircle2, XCircle, Plus, Trash2, Cpu } from 'lucide-react';

// Initial state for the resume data
const initialResume = {
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/aarav-sharma',
  github: 'github.com/aaravsharma',
  summary: 'Motivated Computer Science undergraduate with hands-on experience building full-stack web applications using React, Node.js, and modern CSS. Passionate about writing clean, maintainable code and optimizing web performance.',
  skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Git', 'Tailwind CSS', 'REST API'],
  education: [
    {
      institution: 'Indian Institute of Information Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      year: '2022 - 2026',
      gpa: '8.7 / 10'
    }
  ],
  projects: [
    {
      title: 'InternShield Fraud Detection Platform',
      technologies: 'React, Node.js, Express, MongoDB, SCSS',
      description: 'Built a full-stack platform analyzing suspicious recruiter offers using heuristic scoring algorithms and automated email blacklist validation. Integrated real-time ATS keyword matching and role gap recommendations.'
    },
    {
      title: 'Campus Event Tracker & Registration Portal',
      technologies: 'React, JavaScript, Tailwind CSS, Firebase',
      description: 'Engineered an interactive student dashboard managing university tech hackathons. Implemented search filtering, responsive mobile navigation, and real-time attendee status updates.'
    }
  ],
  experience: [
    {
      role: 'Web Development Lead',
      company: 'College Open Source Society',
      duration: 'Aug 2024 - Present',
      description: 'Mentored 40+ junior students in Git version control and modern React hooks. Conducted weekly code reviews for internal campus applications.'
    }
  ]
};

// Form reducer for managing nested resume state
function resumeReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_RESUME':
      return { ...action.payload };
    case 'ADD_SKILL':
      if (!action.skill || state.skills.includes(action.skill)) return state;
      return { ...state, skills: [...state.skills, action.skill] };
    case 'REMOVE_SKILL':
      return { ...state, skills: state.skills.filter((s) => s !== action.skill) };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects,
          { title: 'New Project', technologies: 'React, Node.js', description: 'Brief description of features and results achieved...' }
        ]
      };
    case 'UPDATE_PROJECT':
      const updatedProjects = [...state.projects];
      updatedProjects[action.index] = { ...updatedProjects[action.index], [action.field]: action.value };
      return { ...state, projects: updatedProjects };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((_, idx) => idx !== action.index)
      };
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [
          ...state.education,
          { institution: 'University Name', degree: 'Degree', year: '2026', gpa: '' }
        ]
      };
    case 'UPDATE_EDUCATION':
      const updatedEdu = [...state.education];
      updatedEdu[action.index] = { ...updatedEdu[action.index], [action.field]: action.value };
      return { ...state, education: updatedEdu };
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter((_, idx) => idx !== action.index)
      };
    default:
      return state;
  }
}

export default function ResumeBuilder() {
  const [resumeData, dispatch] = useReducer(resumeReducer, initialResume);
  const [jobDescription, setJobDescription] = useState(
    'We are hiring a Frontend React Developer Intern. Requirements: Strong proficiency in React, JavaScript, HTML5, CSS3, REST API, Git, and responsive web design. Experience with Node.js and TypeScript is a plus. Must demonstrate strong problem solving skills and teamwork.'
  );

  const [newSkillInput, setNewSkillInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [tailorNotice, setTailorNotice] = useState('');
  const [loadingAction, setLoadingAction] = useState('');

  // 1. Analyze Resume against JD (ATS Score)
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter or paste a Job Description to analyze ATS score.');
      return;
    }
    setLoadingAction('analyze');
    setTailorNotice('');
    try {
      const res = await api.post('/resume/analyze', {
        jobDescription,
        resumeData
      });
      if (res.data.success) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'ATS analysis failed.');
    } finally {
      setLoadingAction('');
    }
  };

  // 2. Tailor Resume without inventing experience
  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter or paste a Job Description first.');
      return;
    }
    setLoadingAction('tailor');
    try {
      const res = await api.post('/resume/tailor', {
        jobDescription,
        resumeData
      });
      if (res.data.success) {
        dispatch({ type: 'SET_RESUME', payload: res.data.data.tailoredResume });
        setTailorNotice('Resume tailored! Matched skills and projects reordered for peak ATS visibility.');
        // Re-analyze tailored resume
        const recheck = await api.post('/resume/analyze', {
          jobDescription,
          resumeData: res.data.data.tailoredResume
        });
        if (recheck.data.success) {
          setAnalysis(recheck.data.data);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Tailoring failed.');
    } finally {
      setLoadingAction('');
    }
  };

  // 3. Trigger Print (PDF export)
  const handlePrint = () => {
    window.print();
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newSkillInput.trim()) {
        dispatch({ type: 'ADD_SKILL', skill: newSkillInput.trim() });
        setNewSkillInput('');
      }
    }
  };

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="container" style={{ maxWidth: '1380px' }}>
        {/* Top Header & Actions Bar (Hidden on print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              ATS Resume Builder & Tailor
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Single-column ATS standard template. Tailored directly to job specifications without fabricating details.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAnalyze}
              disabled={loadingAction === 'analyze'}
              className="btn btn-secondary"
            >
              <Cpu size={16} /> {loadingAction === 'analyze' ? 'Scanning ATS...' : 'Check ATS Score'}
            </button>
            <button
              onClick={handleTailor}
              disabled={loadingAction === 'tailor'}
              className="btn btn-primary"
            >
              <Sparkles size={16} /> {loadingAction === 'tailor' ? 'Optimizing...' : 'Tailor to JD'}
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-success"
            >
              <Printer size={16} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* ATS Score & Keyword Match Card (Hidden on print) */}
        {analysis && (
          <div
            className="no-print ats-score-card"
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '24px 32px',
              marginBottom: '32px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              {/* ATS Score Gauge readout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: analysis.atsScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    border: `3px solid ${analysis.atsScore >= 75 ? '#10b981' : '#f59e0b'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: analysis.atsScore >= 75 ? '#10b981' : '#f59e0b', lineHeight: 1 }}>
                    {analysis.atsScore}%
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-muted)' }}>ATS MATCH</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    {analysis.atsScore >= 75 ? 'High ATS Compatibility' : 'Moderate Keyword Overlap'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                    Matched {analysis.matchedKeywords.length} of {analysis.totalJdKeywords} detected requirements
                  </p>
                </div>
              </div>

              {tailorNotice && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {tailorNotice}
                </div>
              )}
            </div>

            {/* Matched vs Missing Keywords */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} /> Matched Keywords in Resume:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analysis.matchedKeywords.map((k) => (
                    <SkillBadge key={k} skill={k} status="matched" />
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <XCircle size={16} /> Missing Keywords from Job Description:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analysis.missingKeywords.length > 0 ? (
                    analysis.missingKeywords.map((k) => (
                      <SkillBadge key={k} skill={k} status="missing" />
                    ))
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#10b981' }}>All core JD skills are present in your resume!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {analysis.suggestions?.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                <strong>Suggestions:</strong> {analysis.suggestions.join(' ')}
              </div>
            )}
          </div>
        )}

        {/* 2-Column Workspace: Left = Form & JD / Right = A4 ATS Live Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Editor Controls & JD (Hidden on Print) */}
          <div className="no-print resume-form-pane" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Target Job Description Box */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa' }}>Target Job Description (JD)</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Paste full role posting</span>
              </div>
              <textarea
                rows="4"
                className="form-control"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements here to calculate keyword overlap..."
              />
            </div>

            {/* Personal Details Accordion */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormInput
                  label="Full Name"
                  value={resumeData.fullName}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'fullName', value: e.target.value })}
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })}
                />
                <FormInput
                  label="Phone"
                  value={resumeData.phone}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'phone', value: e.target.value })}
                />
                <FormInput
                  label="Location"
                  value={resumeData.location}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'location', value: e.target.value })}
                />
                <FormInput
                  label="LinkedIn URL"
                  value={resumeData.linkedin}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'linkedin', value: e.target.value })}
                />
                <FormInput
                  label="GitHub / Portfolio"
                  value={resumeData.github}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'github', value: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Professional Summary
                </label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={resumeData.summary}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'summary', value: e.target.value })}
                />
              </div>
            </div>

            {/* Technical Skills Editor (Tag input) */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Technical Skills</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  className="form-control"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type skill & press Enter (e.g. Docker, TypeScript)"
                />
                <button type="button" onClick={handleAddSkill} className="btn btn-secondary btn-sm">
                  <Plus size={16} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {resumeData.skills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    status="default"
                    onRemove={() => dispatch({ type: 'REMOVE_SKILL', skill })}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Projects Editor */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Projects</h3>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'ADD_PROJECT' })}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {resumeData.projects.map((proj, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'REMOVE_PROJECT', index: idx })}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Remove Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    value={proj.title}
                    onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', index: idx, field: 'title', value: e.target.value })}
                    placeholder="Project Title"
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={proj.technologies}
                    onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', index: idx, field: 'technologies', value: e.target.value })}
                    placeholder="Technologies (e.g. React, Node.js, Express)"
                    style={{ marginBottom: '8px' }}
                  />
                  <textarea
                    rows="3"
                    className="form-control"
                    value={proj.description}
                    onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', index: idx, field: 'description', value: e.target.value })}
                    placeholder="Description of architecture and impact..."
                  />
                </div>
              ))}
            </div>

            {/* Dynamic Education Editor */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Education</h3>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'ADD_EDUCATION' })}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>

              {resumeData.education.map((edu, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Education #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'REMOVE_EDUCATION', index: idx })}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.institution}
                    onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', index: idx, field: 'institution', value: e.target.value })}
                    placeholder="College / University"
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.degree}
                      onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', index: idx, field: 'degree', value: e.target.value })}
                      placeholder="Degree & Major"
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={edu.year}
                      onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', index: idx, field: 'year', value: e.target.value })}
                      placeholder="Graduation Year"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Printable A4 ATS Resume Preview */}
          <div
            className="resume-preview-pane"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '12px',
              padding: '44px 48px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
              fontSize: '10pt',
              lineHeight: '1.45',
              position: 'sticky',
              top: '90px'
            }}
          >
            {/* Header: Name and Contact */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '14px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '18pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, color: '#0f172a' }}>
                {resumeData.fullName || 'YOUR NAME'}
              </h1>
              <div style={{ marginTop: '6px', fontSize: '9pt', color: '#334155', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.phone && <span>&bull; {resumeData.phone}</span>}
                {resumeData.location && <span>&bull; {resumeData.location}</span>}
              </div>
              <div style={{ marginTop: '3px', fontSize: '9pt', color: '#1d4ed8', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                {resumeData.linkedin && <span>{resumeData.linkedin}</span>}
                {resumeData.github && <span>&bull; {resumeData.github}</span>}
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px', color: '#0f172a' }}>
                  Professional Summary
                </h2>
                <p style={{ margin: 0, textAlign: 'justify', color: '#1e293b' }}>
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Technical Skills */}
            {resumeData.skills?.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px', color: '#0f172a' }}>
                  Technical Skills
                </h2>
                <p style={{ margin: 0, color: '#1e293b' }}>
                  <strong>Languages & Frameworks:</strong> {resumeData.skills.join(', ')}
                </p>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects?.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '8px', color: '#0f172a' }}>
                  Technical Projects
                </h2>
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '10.5pt', color: '#0f172a' }}>{proj.title}</strong>
                      <span style={{ fontSize: '9pt', fontStyle: 'italic', color: '#475569' }}>{proj.technologies}</span>
                    </div>
                    <p style={{ margin: '3px 0 0', color: '#334155' }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {resumeData.experience?.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '8px', color: '#0f172a' }}>
                  Leadership & Experience
                </h2>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '10.5pt', color: '#0f172a' }}>{exp.role} &ndash; {exp.company}</strong>
                      <span style={{ fontSize: '9pt', color: '#475569' }}>{exp.duration}</span>
                    </div>
                    <p style={{ margin: '3px 0 0', color: '#334155' }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resumeData.education?.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '8px', color: '#0f172a' }}>
                  Education
                </h2>
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div>
                      <strong style={{ color: '#0f172a' }}>{edu.institution}</strong>
                      <div style={{ color: '#334155', fontSize: '9pt' }}>{edu.degree}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '9pt', color: '#475569' }}>
                      <div>{edu.year}</div>
                      {edu.gpa && <div>CGPA: {edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
