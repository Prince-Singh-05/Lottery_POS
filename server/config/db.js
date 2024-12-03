import mongoose from "mongoose";
import {} from "dotenv/config";

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Database connected successfully");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};
