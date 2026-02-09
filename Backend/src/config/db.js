import mongoose from "mongoose";
import { db_name } from "../utils/constant.js";

const connectDB = async() => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${db_name}`);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;