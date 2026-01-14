import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const FAN_ID = "693f198ffa8e64558eb4dea1";
const BROKER_URL = process.env.MQTT_BROKER || "mqtt://localhost:1883";

// ================= STATE =================
let fanState = {
  fanId: FAN_ID,
  status: "OFF",
  speed: 0,
  temperature: 80, // từ 30 → 100
};

const client = mqtt.connect(BROKER_URL);

// ================= CONNECT =================
client.on("connect", () => {
  console.log("🤖 Fan Simulator connected to MQTT");

  client.subscribe("home/fan/command", () => {
    console.log("📡 Listening: home/fan/command");
  });

  publishState();
});

// ================= RECEIVE COMMAND =================
client.on("message", (topic, message) => {
  if (topic !== "home/fan/command") return;

  try {
    const cmd = JSON.parse(message.toString());
    if (cmd.fanId !== FAN_ID) return;

    console.log("⚡ Command received:", cmd);

    // ===== HANDLE COMMAND =====
    if (cmd.status === "ON") {
      fanState.status = "ON";
      fanState.speed = cmd.speed ?? fanState.speed ?? 1;
    }

    if (cmd.status === "OFF") {
      fanState.status = "OFF";
      fanState.speed = 0;
    }

    if (cmd.status === "SET_SPEED") {
      fanState.status = "ON";
      fanState.speed = cmd.speed ?? fanState.speed;
    }

    simulateTemperature();
    publishState();
  } catch (err) {
    console.error("❌ Command parse error:", err.message);
  }
});

function simulateTemperature() {
  if (fanState.status === "ON") {
    // giảm nhiệt độ khi bật quạt
    fanState.temperature -= random(0.5, 1.2);
  } else {
    // tăng nhiệt độ khi tắt quạt
    fanState.temperature += random(0.2, 0.6);
  }

  // clamp 30 - 100
  fanState.temperature = Math.max(
    30,
    Math.min(100, Number(fanState.temperature.toFixed(1)))
  );
}


function publishState() {
  const payload = JSON.stringify(fanState);

  client.publish("home/fan/state", payload, () => {
    console.log("📤 State sent:", payload);
  });
}


function random(min, max) {
  return Math.random() * (max - min) + min;
}

client.on("error", (err) => {
  console.error("❌ MQTT error:", err.message);
});
