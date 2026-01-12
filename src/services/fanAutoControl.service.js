import FanIoT from '../models/Model.FanIoT.js';
import mqttController from '../config/mqttController.js';

export const autoControlFanByTemperature = async () => {
  const fans = await FanIoT.find({
    TemperatureSensor: { $ne: null },
    Thresholdvalue: { $ne: null },
  }).lean();

  console.log('🔥 Auto controlling fans...', fans.length);

  for (const fan of fans) {
    const {
      FAN_ID,
      TemperatureSensor,
      Thresholdvalue,
      status,
      speed = 0,
    } = fan;

    let nextStatus = status;
    let nextSpeed = speed;

    // ===== LOGIC RÕ RÀNG =====
    if (TemperatureSensor >= 80) {
      nextStatus = 'ON';
      nextSpeed = 100;
    } else if (TemperatureSensor >= 60) {
      nextStatus = 'ON';
      nextSpeed = 50;
    } else if (TemperatureSensor > Thresholdvalue) {
      nextStatus = 'ON';
      nextSpeed = 20;
    } else if (TemperatureSensor < Thresholdvalue - 3) {
      nextStatus = 'OFF';
      nextSpeed = 0;
    }

    // ===== KHÔNG THAY ĐỔI → KHÔNG GỬI MQTT =====
    if (nextStatus === status && nextSpeed === speed) continue;

    console.log(
      `⚙️ Fan ${FAN_ID}: ${TemperatureSensor}°C → ${nextStatus} (${nextSpeed}%)`
    );

    mqttController.sendFanCommand({
      fanId: FAN_ID,
      status: nextStatus,
      speed: nextSpeed,
    });

    // ===== UPDATE DB =====
    await FanIoT.updateOne(
      { FAN_ID },
      {
        status: nextStatus,
        speed: nextSpeed,
        lastAutoUpdatedAt: new Date(),
      }
    );
  }
};
