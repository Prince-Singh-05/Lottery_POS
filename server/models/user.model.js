import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		shop: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Shop",
			},
		],
		role: {
			type: String,
			enum: ["admin", "shop_owner", "customer"],
			default: "customer",
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
