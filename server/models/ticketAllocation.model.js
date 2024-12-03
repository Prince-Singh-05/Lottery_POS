import mongoose from "mongoose";

const ticketAllocationSchema = new mongoose.Schema(
	{
		ticketType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "TicketType",
			required: true,
		},
		shop: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shop",
			required: true,
		},
		startRange: {
			type: Number,
			required: true,
		},
		endRange: {
			type: Number,
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

ticketAllocationSchema.index(
	{ ticketType: 1, startRange: 1, endRange: 1 },
	{ unique: true }
);

const TicketAllocation = mongoose.model(
	"TicketAllocation",
	ticketAllocationSchema
);

export default TicketAllocation;
