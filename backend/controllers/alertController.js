/**
 * Alert Controller
 * Syllabus: Exp 11 (Notification feeds, Unread counter, State mutation endpoints)
 */
const Alert = require('../models/Alert');

/**
 * Get user alerts (optionally filtered by ?unread=true)
 * GET /api/alerts
 */
const getAlerts = async (req, res, next) => {
  try {
    const { unread } = req.query;
    const query = { user: req.user._id };

    if (unread === 'true') {
      query.isRead = false;
    }

    const alerts = await Alert.find(query)
      .populate('internship', 'title company location stipend mode verified trustScore applyLink')
      .sort({ createdAt: -1 });

    const unreadCount = await Alert.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single alert as read
 * PATCH /api/alerts/:id/read
 */
const markAlertAsRead = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert marked as read.',
      data: alert
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all alerts as read
 * PATCH /api/alerts/read-all
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Alert.updateMany({ user: req.user._id, isRead: false }, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an alert
 * DELETE /api/alerts/:id
 */
const deleteAlert = async (req, res, next) => {
  try {
    const deleted = await Alert.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert removed.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  markAlertAsRead,
  markAllAsRead,
  deleteAlert
};
