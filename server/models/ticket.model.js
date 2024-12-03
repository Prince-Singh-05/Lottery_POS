import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
	{
		ticketNumber: {
			type: Number,
			required: true,
			unique: true,
		},
		ticketType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "TicketType",
			required: true,
		},
		shop: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shop",
		},
		status: {
			type: String,
			enum: ["available", "sold", "winning", "claimed", "expired"],
			default: "available",
		},
		expiryDate: {
			type: Date,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		winningAmount: {
			type: Number,
			default: 0,
		},
		soldTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		soldAt: {
			type: Date,
		},
		claimedAt: {
			type: Date,
		},
		claimedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

ticketSchema.index({ shop: 1, ticketNumber: 1 }, { unique: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
