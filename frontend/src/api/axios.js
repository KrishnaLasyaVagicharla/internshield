/**
 * Axios Instance Configuration
 * Syllabus: Exp 11 (Client-server HTTP communication, Session Cookies via withCredentials)
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for Express session cookie exchange
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for centralized error notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, session may have expired
    if (error.response && error.response.status === 401) {
      console.warn('[API] Session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);

export default api;
