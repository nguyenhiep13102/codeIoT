import mqtt from "mqtt";

const createMQTTClient = () => {
  if (!process.env.MQTT_BROKER) {
    console.error("❌ MQTT_BROKER chưa được khai báo trong .env");
    process.exit(1);
  }

  const client = mqtt.connect(process.env.MQTT_BROKER);

  client.on("connect", () => {
    console.log("🔌 MQTT connected:", process.env.MQTT_BROKER);
  });

  client.on("reconnect", () => {
    console.log("♻️ MQTT reconnecting...");
  });

  client.on("error", (err) => {
    console.error("❌ MQTT error:", err);
  });

  return client;
};

export default createMQTTClient;
