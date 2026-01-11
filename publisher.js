import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const FAN_ID = "693f198ffa8e64558eb4dea1";

const client = mqtt.connect(process.env.MQTT_BROKER);

client.on("connect", () => {
  console.log("✅ Publisher connected to MQTT broker");

  // Gửi dữ liệu giả lập mỗi 2 giây
  setInterval(() => {
    const status = Math.random() > 0.5 ? "ON" : "OFF";
    const speed = status === "ON" ? Math.floor(Math.random() * 5) + 1 : 0;
    const temperature = Number((20 + Math.random() * 10).toFixed(1));

    const payload = JSON.stringify({
      fanId: FAN_ID,
      status,
      speed,
      temperature
    });

    client.publish("home/fan/state", payload, {}, (err) => {
      if (err) {
        console.error("❌ Publish error:", err);
      } else {
        console.log("📤 Published:", payload);
      }
    });
  }, 10000);
});

client.on("error", (err) => {
  console.error("❌ Publisher MQTT Error:", err.message);
});
