import mongoose from 'mongoose';

const ModelFanIoT = new mongoose.Schema(
  {
    IdUser: { type: String,  },
    FAN_ID: { type: String,  },
    name: { type: String,  },
    IdType : { type: String,  },
    status: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
    
    Speed: { type: Number,  },
    TemperatureSensor: { type: Number,},  // nhiệt độ cảm biến
    Thresholdvalue: { type: Number,},   //giá trị ngưỡng  
    Auto :{type : Boolean},
  },
  {
    timestamps: true,
  }
);


const FanIoT = mongoose.model('FanIoT', ModelFanIoT);
export default FanIoT ;
