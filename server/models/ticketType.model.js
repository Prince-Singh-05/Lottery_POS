import mongoose from "mongoose";

const ticketTypeSchema = new mongoose.Schema(
	{
		// shop: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "Shop",
		// 	required: true,
		// },
		name: {
			type: String,
			enum: ["Daily Draws", "Weekly Draws", "Monthly Draws"],
			required: true,
		},
		numberPattern: {
			startRange: {
				type: Number,
				required: true,
			},
			endRange: {
				type: Number,
				required: true,
			},
			digits: {
				type: Number,
				required: true,
			},
		},
		price: {
			type: Number,
			required: true,
		},
		expiryDuration: {
			type: Number, // in days
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const TicketType = mongoose.model("TicketType", ticketTypeSchema);

export default TicketType;
