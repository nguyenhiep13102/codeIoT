import FanIoT from '../models/Model.FanIoT.js';
import HistoryFanIoT from '../models/Model.HistoryFan.js';


const CreateFanIoT = async (data) => {
    try {
        const { name, Type, status,SpeedMax, Speed, TemperatureSensor, Thresholdvalue } = data;
        const newFan  = new FanIoT({
            name,
            Type,
            status, 
            SpeedMax,
            Speed,
            TemperatureSensor,
            Thresholdvalue  
        });

        const savefan = await newFan.save();

        return {
            status: "success",
            message: "Tạo đối tượng thành công !",
            fan : {
                id: savefan._id,
                name: savefan.name,
                
            },
        };
    } catch (e) {      
        throw e;
    }
};
const getFanByIdService = async (IdUser) => {
 
  if (!IdUser) {
    throw new Error("INVALID_USER_ID");
  }

  const fans = await FanIoT.find({ IdUser });

  if (!fans.length) {
    throw new Error("FAN_NOT_FOUND");
  }

  return fans;
};

// const updateFanFromMQTT = async (fanId, data) => {

   
   
//      const fans = await FanIoT.find({ FAN_ID: fanId });
//      console.log("danh sach quat:", fans);
//      var id = fans._id;
//   if (!fanId.match(/^[0-9a-fA-F]{24}$/)) {
//     throw new Error("INVALID_ID");
//   }

//   const fan = await FanIoT.findByIdAndUpdate(
//     id,
//     {
//       $set: {
//         status: data.status,
//         Speed: data.speed,
//         TemperatureSensor: data.temperature,
//         updatedAt: new Date()
//       }
//     },
//     { new: true }
//   );

//   if (!fan) {
//     throw new Error("FAN_NOT_FOUND");
//   }

//   return fan;
// };
const updateFanFromMQTT = async (fanId, data) => {
  const result = await FanIoT.updateMany(
    { FAN_ID: fanId },
    {
      $set: {
        status: data.status,
        Speed: data.speed,
        TemperatureSensor: data.temperature,
        updatedAt: new Date(),
      },
    }
  );

  const historyEntry = new HistoryFanIoT({
    FAN_ID: fanId,
    status: data.status,
    Speed: data.speed,
    TemperatureSensor: data.temperature,
  });
  const saveHistory = await historyEntry.save();
console.log("Saved history entry:", saveHistory);

  if (result.matchedCount === 0) {
    throw new Error("FAN_NOT_FOUND");
  }

  return result;
};

const getFanById = async (id) => {
 
  if (!id) {
    throw new Error("INVALID__ID");
  }

  const fans = await FanIoT.findById( id );

  return fans;
};

export default {
    CreateFanIoT,
    getFanByIdService,
    updateFanFromMQTT,
    getFanById,
};