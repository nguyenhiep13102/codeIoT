import mongoose from 'mongoose';

const HistoryFanIoT = new mongoose.Schema(
  {
   
    FAN_ID: { type: String,  },
    status: { type: String,  }, 
    Speed: { type: Number,  },
    TemperatureSensor: { type: Number,},  // nhiệt độ cảm biến
   
    
  },
  {
    timestamps: true,
  }
);


const FanIoT = mongoose.model('HistoryFanIoT', HistoryFanIoT);
export default FanIoT ;
