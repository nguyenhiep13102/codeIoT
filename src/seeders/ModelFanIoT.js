import mongoose from "mongoose";
import FanIoT from "../models/Model.FanIoT.js"; // sửa đúng path nếu khác

const seedFanIoT = async () => {
  try {
    await mongoose.connect("mongodb+srv://root:123@cluster0.qg45u.mongodb.net/Code_IoT?retryWrites=true&w=majority&appName=Cluster0");

    console.log("✅ MongoDB connected");

    // Xóa dữ liệu cũ
    await FanIoT.deleteMany({});
    console.log("🗑️ Old FanIoT data removed");

    // Data seed
    const data = [
      {
        IdUser: "6941fd6f4bf4bb0bd384dc57",
        FAN_ID: "FAN_IOT_001",
        name: "Quạt phòng khách",
        IdType: "TYPE_FAN_001",
        status: "OFF",
        Speed: "0",
        TemperatureSensor: "30",   // °C
        Thresholdvalue: "35",      // °C
      },
      {
        IdUser: "6941fd6f4bf4bb0bd384dc57",
        FAN_ID: "FAN_IOT_002",
        name: "Quạt phòng ngủ",
        IdType: "TYPE_FAN_002",
        status: "ON",
        Speed: "2",
        TemperatureSensor: "28",
        Thresholdvalue: "32",
      },
      {
        IdUser: "6941fd6f4bf4bb0bd384dc57",
        FAN_ID: "FAN_IOT_003",
        name: "Quạt nhà xưởng",
        IdType: "TYPE_FAN_003",
        status: "ON",
        Speed: "5",
        TemperatureSensor: "38",
        Thresholdvalue: "36",
      },
      {
        IdUser: "6941fd6f4bf4bb0bd384dc57",
        FAN_ID: "FAN_IOT_004",
        name: "Quạt kho hàng",
        IdType: "TYPE_FAN_004",
        status: "OFF",
        Speed: "0",
        TemperatureSensor: "29",
        Thresholdvalue: "34",
      },
    ];

    await FanIoT.insertMany(data);

    console.log("🌱 Seed FanIoT data thành công");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedFanIoT();
