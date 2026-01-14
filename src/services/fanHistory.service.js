import HistoryFanIoT from "../models/Model.HistoryFan.js";

 const getLast100FanData = async (fanId) => {
  const data = await HistoryFanIoT.find({ FAN_ID: fanId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  // đảo ngược để vẽ chart từ cũ → mới
  return data.reverse();
};

export default {
  getLast100FanData,
};