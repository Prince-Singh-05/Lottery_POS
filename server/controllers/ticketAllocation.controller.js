import TicketAllocation from "../models/ticketAllocation.model.js";
import TicketService from "../services/ticketService.js";

const allocateTicketsToShop = async (req, res) => {
	try {
		const { ticketTypeId, shopId, startRange, endRange } = req.body;

		// validate ticket type and ranges
		const ticketType = await TicketService.validateTicketType(ticketTypeId);
		await TicketService.validateTicketRanges(
			ticketTypeId,
			startRange,
			endRange
		);

		// validate ticket number
		// await TicketService.validateTicketNumber(
		// 	ticketNumber,
		// 	ticketType,
		// 	shop
		// );

		// find available ticket
		// const ticket = await TicketService.findAvailableTicket(
		// 	ticketNumber,
		// 	ticketTypeId,
		// 	shop
		// );

		// check ticket expiry
		// await TicketService.checkTicketExpiry(ticket);

		// create ticket allocation
		const allocation = await TicketAllocation.create({
			ticketType: ticketTypeId,
			shop: shopId,
			startRange,
			endRange,
		});

		// Generate tickets for this ticket type
		await TicketService.generateTicketsForAllocation(
			allocation,
			ticketType
		);

		res.status(201).json(allocation);
	} catch (error) {
		console.log(`Error allocating tickets: ${error}`);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getShopAllocations = async (req, res) => {
	try {
		const { shopId } = req.body;
		const allocations = await TicketAllocation.find({ shop: shopId })
			.populate("ticketType")
			.sort("-createdAt")
			.exec();

		res.status(200).json(allocations);
	} catch (error) {
		console.log(`Error getting shop allocations: ${error}`);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { allocateTicketsToShop, getShopAllocations };
