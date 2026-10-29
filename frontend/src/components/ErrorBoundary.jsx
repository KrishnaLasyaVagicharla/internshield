/**
 * ErrorBoundary Component (Class Component Demonstration)
 * Syllabus: Exp 5 (React Class Components, Lifecycle Methods & Error Boundaries)
 */
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // Lifecycle method invoked after an error has been thrown by a descendant component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Lifecycle method for logging error details
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'var(--color-card)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          margin: '24px auto',
          maxWidth: '600px'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Something went wrong.</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred in this view.'}
          </p>
          <button
            onClick={this.handleReset}
            className="btn btn-primary btn-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
