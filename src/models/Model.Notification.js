// models/Notification.model.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        FAN_ID: {
            type: String,
        },

        title: {
            type: String,
        },

        description: {
            type: String,
        },
        isRead: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
