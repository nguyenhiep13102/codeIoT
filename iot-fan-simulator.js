import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const FAN_ID = "695a22773b33135dba4d4683";
const BROKER_URL = process.env.MQTT_BROKER || "mqtt://localhost:1883";

let fanState = {
  fanId: FAN_ID,
  status: "on",
  speed: 0,
  temperature: 28
};

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
  console.log("🤖 IoT Fan Simulator connected");

  // Nhận lệnh điều khiển
  client.subscribe("home/fan/command", () => {
    console.log("📡 Listening: home/fan/command");
  });

  // Gửi trạng thái định kỳ (optional)
  setInterval(() => {
    publishState();
  }, 5000);
});

client.on("message", (topic, message) => {
  if (topic !== "home/fan/command") return;

  try {
    const data = JSON.parse(message.toString());

    // Bỏ qua nếu không phải quạt này
    if (data.fanId !== FAN_ID) return;

    console.log("⚡ Fan nhận lệnh:", data);

    // Xử lý lệnh
    switch (data.status) {
      case "ON":
        fanState.status = "on";
        fanState.speed = data.speed || 1;
        break;

      case "OFF":
        fanState.status = "off";
        fanState.speed = 0;
        break;

      case "SET_SPEED":
        fanState.status = "on";
        fanState.speed = data.speed || fanState.speed;
        break;

      default:
        console.warn("⚠️ Lệnh không hợp lệ:", data.command);
        return;
    }

    // Giả lập nhiệt độ thay đổi
    fanState.temperature =
      fanState.status === "on"
        ? fanState.temperature - 0.3
        : fanState.temperature + 0.2;

    // Gửi trạng thái sau khi thực thi
    publishState();
  } catch (error) {
    console.error("❌ Lỗi xử lý lệnh:", error.message);
  }
});

function publishState() {
  const payload = JSON.stringify(fanState);

  client.publish("home/fan/state", payload, () => {
    console.log("📤 Fan gửi state:", payload);
  });
}

client.on("error", (err) => {
  console.error("❌ MQTT error:", err.message);
});
