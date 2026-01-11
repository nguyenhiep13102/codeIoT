import createMQTTClient from "../config/mqtt.js";

let client;

 const initMQTTController = () => {
  client = createMQTTClient();

  client.on("connect", () => {
    console.log("✅ MQTT Controller connected");
  });
};

/**
 * Gửi lệnh điều khiển quạt qua MQTT
 * @param {Object} data
 * data = { fanId, command, speed }
 */
 const sendFanCommand = (data) => {
  if (!client) {
    console.error("❌ MQTT Controller chưa khởi tạo.");
    return;
  }

  const payload = JSON.stringify(data);

  client.publish("home/fan/command", payload, (err) => {
    if (err) {
      console.error("❌ Publish error:", err);
    } else {
      console.log("🚀 Đã gửi lệnh quạt:", payload);
    }
  });
};
export default {
   initMQTTController,
   sendFanCommand,
}