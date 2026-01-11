import mongoose from "mongoose";
import TypeFan from "../models/Model.TypeFanIoT.js"; // sửa đúng path nếu khác

const seedTypeFan = async () => {
  try {
    await mongoose.connect("mongodb+srv://root:123@cluster0.qg45u.mongodb.net/Code_IoT?retryWrites=true&w=majority&appName=Cluster0");

    console.log("✅ MongoDB connected");


    await TypeFan.deleteMany({});
    console.log("🗑️ Old TypeFan data removed");

    
    const data = [
      {
        name: "Quạt IoT Mini",
        CongSuat: "45W",
        status: "OFF",
        DacDiem: "Tiết kiệm điện, điều khiển qua app",
        TocDo: "3",
        SpeedMax: "1200 RPM",
      },
      {
        name: "Quạt IoT Cao Cấp",
        CongSuat: "60W",
        status: "ON",
        DacDiem: "Kết nối WiFi, điều khiển từ xa",
        TocDo: "5",
        SpeedMax: "1500 RPM",
      },
      {
        name: "Quạt Công Nghiệp IoT",
        CongSuat: "120W",
        status: "OFF",
        DacDiem: "Công suất lớn, dùng trong nhà xưởng",
        TocDo: "7",
        SpeedMax: "2200 RPM",
      },
      {
        name: "Quạt Treo Tường IoT",
        CongSuat: "55W",
        status: "OFF",
        DacDiem: "Thiết kế treo tường, tiết kiệm không gian",
        TocDo: "4",
        SpeedMax: "1400 RPM",
      },
    ];

    await TypeFan.insertMany(data);

    console.log("🌱 Seed TypeFan data thành công");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedTypeFan();
