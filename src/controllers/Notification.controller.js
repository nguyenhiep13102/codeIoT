
import Notification from '../models/Model.Notification.js';
import FanIoT from '../models/Model.FanIoT.js';
 const getLatestNotifications = async (req, res) => {
  try {
    const { fanId } = req.params;

    const notifications = await Notification.find({ FAN_ID: fanId })
      .sort({ createdAt: -1 }) 
      .limit(10);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};
 const getUnreadCount = async (req, res) => {
  try {
    const { fanId } = req.params;

    const count = await Notification.countDocuments({
      FAN_ID: fanId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to count unread notifications',
    });
  }
};
 const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification',
    });
  }
};
const createNotificationIfNeeded = async ({
  fanId,
  status,
  speed,
  temperature,
}) => {
 
  if (temperature <= 70) {
    console.log(
      `ℹ Fan ${fanId}: temperature ${temperature}°C (no warning)`
    );
    return null;
  }

 console.log(` Checking notification for Fan ${temperature}...`);
  const notification = await Notification.create({
    FAN_ID: fanId,
    title: "⚠️ Cảnh báo nhiệt độ cao",
    description: `Nhiệt độ ${temperature}°C vượt ngưỡng an toàn`,
    isRead: false,
  });

  console.log(
    `🔥 WARNING Fan ${fanId}: temperature ${temperature}°C`
  );

  return notification;
};
const getLatestNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    

   
    const fans = await FanIoT.find(
      { IdUser: userId },
      { FAN_ID: 1, _id: 0 }
    );
   console.log("Danh sach quat cua user:", fans);
    const fanIds = fans.map(f => f.FAN_ID);

    
    const notifications = await Notification.find({
      FAN_ID: { $in: fanIds },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

 export default {
  getLatestNotifications,
  getUnreadCount,
  markAsRead,
  createNotificationIfNeeded,
  getLatestNotificationsByUser
 };