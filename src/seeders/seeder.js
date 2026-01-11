import connectToDatabase from '../config/connect.js';
import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import Order from '../models/OderProduct.js';

const ensureCollectionsExist = async () => {
  await connectToDatabase();

  const collections = [
    { model: Product, name: 'Product' },
    { model: User, name: 'User' },
    { model: Order, name: 'Order' },
  ];

  for (const collection of collections) {
    const count = await collection.model.countDocuments();
    if (count === 0) {
      console.log(`📂 Collection '${collection.name}' chưa có dữ liệu, nhưng sẽ được tạo khi có dữ liệu.`);
    } else {
      console.log(`✅ Collection '${collection.name}' đã tồn tại.`);
    }
  }

  process.exit();
};

// Gọi hàm này khi chạy file
 export default ensureCollectionsExist;
