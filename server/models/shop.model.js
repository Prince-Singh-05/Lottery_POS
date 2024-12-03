import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		registrationId: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
