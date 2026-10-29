/**
 * ClassTrustMeter Component (Class Component Demonstration)
 * Syllabus: Exp 5 (Class components, this.state, componentDidMount, componentDidUpdate)
 */
import React, { Component } from 'react';

class ClassTrustMeter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayScore: 0,
      animating: true
    };
  }

  componentDidMount() {
    this.animateToTarget(this.props.score || 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.score !== this.props.score) {
      this.animateToTarget(this.props.score || 0);
    }
  }

  animateToTarget(target) {
    this.setState({ animating: true });
    let current = 0;
    const step = Math.max(1, Math.floor(target / 25));
    
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(this.timer);
        this.setState({ displayScore: current, animating: false });
      } else {
        this.setState({ displayScore: current });
      }
    }, 20);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  getColor(score) {
    if (score >= 70) return '#10b981'; // Green (Real)
    if (score >= 40) return '#f59e0b'; // Amber (Suspicious)
    return '#ef4444'; // Red (Fake)
  }

  render() {
    const { displayScore } = this.state;
    const { label } = this.props;
    const color = this.getColor(displayScore);

    return (
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        border: `1px solid ${color}`
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
          {label || 'Class Trust Gauge'}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: color, fontFamily: 'monospace' }}>
          {displayScore}<span style={{ fontSize: '1rem', color: 'var(--color-muted)' }}>/100</span>
        </div>
      </div>
    );
  }
}

export default ClassTrustMeter;
