import mongoose from 'mongoose';

const ModelTypeFan = new mongoose.Schema(
  {
    name: { type: String,  },
    CongSuat : { type: String,  },
    status: { type: String,  },
    DacDiem: { type: String,  },
    TocDo: { type: Number,  },
    SpeedMax: { type: String,  },
  },
  {
    timestamps: true,
  }
);

// Tạo và xuất mô hình người dùng
const TypeFan = mongoose.model('ModelTypeFan', ModelTypeFan);
export default TypeFan ;
