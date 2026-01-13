import mqttController from "../config/mqttController.js";
import FanIoTService from "../services/FanIoTServices.js";
import historyFan from "../services/fanHistory.service.js";
const createFanIoT = async (req, res) => {
  try {
    const {
      name,
      Type,
      status,
      SpeedMax,
      Speed,
      TemperatureSensor,
      Thresholdvalue
    } = req.body;

    if (!name || !Type) {
      return res.status(400).json({
        status: "error",
        message: "name và Type là bắt buộc"
      });
    }

    const result = await FanIoTService.CreateFanIoT({
      name,
      Type,
      status,
      SpeedMax,
      Speed,
      TemperatureSensor,
      Thresholdvalue
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("❌ createFanIoT error:", error);

    return res.status(500).json({
      status: "error",
      message: "Lỗi server",
      error: error.message
    });
  }
};

export const getFanByUserId = async (req, res) => {
  try {
    const {IdUser} = req.params;
   
    const fan = await FanIoTService.getFanByIdService(IdUser);

    return res.json({
      status: "success",
      total: fan.length,
      data: fan
    });
  } catch (error) {
    console.error("❌ getFanById error:", error.message);

    if (error.message === "INVALID_ID") {
      return res.status(400).json({
        status: "error",
        message: "ID không hợp lệ"
      });
    }

    if (error.message === "FAN_NOT_FOUND") {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy quạt"
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Lỗi server"
    });
  }
};
export const getFanById = async (req, res) => {
  try {
    const {id} = req.params;
    console.log("Fetching fan with ID:", id);
   
    const fan = await FanIoTService.getFanById(id);

    return res.json({
      status: "success",
      total: fan.length,
      data: fan
    });
  } 
  catch (error) {
    console.error("❌ getFanById error:", error.message);

   
    return res.status(500).json({
      status: "error",
      message: "Lỗi server"
    });
  }
};



export const controlFan =  async (req, res) => {
  const { fanId,status , speed } = req.body;

  if (!fanId || !status) {
    return res.status(400).json({
      message: "fanId và command là bắt buộc"
    });
  }
  const fans = await FanIoTService.getFanById(fanId);
console.log("Controlling fan:", fans);
 
  mqttController.sendFanCommand({
    fanId,
    status,
    speed
  });

  return res.json({
    status: "success",
    message: "Đã gửi lệnh điều khiển quạt",
    data: { fanId, status, speed }
  });
};


const getFanChartData = async (req, res) => {
  try {
    const { fanId } = req.params;

    const data = await historyFan.getLast100FanData(fanId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const settingAuto = async (req, res) => {
  try {
    const { fanId } = req.params;
     const data = await FanIoTService.settingAuto(fanId);
    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export default {
    createFanIoT,
    controlFan,
    getFanById,
    getFanByUserId,
    getFanChartData,
  
    settingAuto,

};