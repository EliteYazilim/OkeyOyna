import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("❌ MongoDB bağlantı hatası:", err);
    process.exit(1);
  }
};
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB bağlantısı kesildi");
  } catch (err) {
    console.error("❌ MongoDB bağlantı kesme hatası:", err);
  }
};