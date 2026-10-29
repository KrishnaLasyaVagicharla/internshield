/**
 * Alert Context (Real-time Notification State)
 * Syllabus: Exp 7 (State lifting & cross-component communication for Navbar badge)
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!isAuthenticated) {
      setAlerts([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/alerts');
      if (res.data.success) {
        setAlerts(res.data.data);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Mark single alert as read
  const markAsRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isRead: true } : a))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  // Mark all alerts as read
  const markAllAsRead = async () => {
    try {
      await api.patch('/alerts/read-all');
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Delete alert
  const deleteAlert = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      const targetAlert = alerts.find((a) => a._id === id);
      if (targetAlert && !targetAlert.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        loading,
        fetchAlerts,
        markAsRead,
        markAllAsRead,
        deleteAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
