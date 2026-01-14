import createMQTTClient from "../config/mqtt.js";
import FanIoTService from "../services/FanIoTServices.js";
import Notification from "../controllers/Notification.controller.js";
let fanState = null;

export const startMQTTListener = () => {
  const client = createMQTTClient();

  client.on("connect", () => {
    client.subscribe("home/fan/state", (err) => {
      if (err) console.log(" Subscribe lỗi:", err);
      else console.log("📡 Đang nghe topic: home/fan/state");
    });
  });

  client.on("message", async (topic, message) => {
    if (topic !== "home/fan/state") return;

    try {
      const payload = JSON.parse(message.toString());
      console.log(" MQTT payload:", payload);

      const { fanId, status, speed, temperature } = payload;

      if (!fanId) {
        console.error(" MQTT thiếu fanId");
        return;
      }

      fanState = payload;

      await FanIoTService.updateFanFromMQTT(fanId, {
        status,
        speed,
        temperature
      });
       await Notification.createNotificationIfNeeded({
  fanId,
  status,
  speed,
  temperature,
});
      console.log(` Fan ${fanId} updated in DB`);
    } catch (error) {
      console.error(" MQTT message error:", error.message);
    }
  });

  return client;
};

export const getFanState = () => fanState;
