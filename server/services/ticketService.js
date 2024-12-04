import Ticket from "../models/ticket.model.js";
import TicketAllocation from "../models/ticketAllocation.model.js";
import TicketType from "../models/ticketType.model.js";

class TicketService {
  static async validateTicketType(ticketTypeId) {
    const ticketType = await TicketType.findById(ticketTypeId);
    if (!ticketType) {
      throw new Error("Ticket type not found");
    }
    return ticketType;
  }

  static async validateTicketRanges(ticketTypeId, satrtRange, endRange) {
    const overlapping = await TicketAllocation.findOne({
      ticketType: ticketTypeId,
      $or: [
        {
          startRange: { $lte: endRange },
          endRange: { $gte: satrtRange },
        },
      ],
    });

    if (overlapping) {
      throw new Error("Ticket ranges overlaps with existing allocation");
    }

    const ticketType = await TicketType.findById(ticketTypeId);

    if (
      satrtRange < ticketType.numberPattern.startRange ||
      endRange > ticketType.numberPattern.endRange ||
      satrtRange > endRange
    ) {
      throw new Error("Invalid ticket ranges");
    }
  }

  static async validateTicketNumber(ticketNumber, ticketType, shop) {
    const numericTicketNumber = parseInt(ticketNumber);

    const allocation = await TicketAllocation.findOne({
      ticketType: ticketType._id,
      shop: shop._id,
      startRange: { $lte: numericTicketNumber },
      endRange: { $gte: numericTicketNumber },
    });

    if (!allocation) {
      throw new Error("Ticket number not allocated to this shop");
    }

    if (ticketNumber.length !== ticketType.numberPattern.digits) {
      throw new Error("Invalid ticket number");
    }
  }

  static async findAvailableTicket(ticketNumber, ticketTypeId, shop) {
    const ticket = await Ticket.findOne({
      ticketNumber,
      ticketType: ticketTypeId,
      shop: shop._id,
      status: "available",
    });

    if (!ticket) {
      throw new Error("Ticket not found or already sold");
    }

    return ticket;
  }

  static async checkTicketExpiry(ticket) {
    if (new Date() > ticket.expiryDate) {
      ticket.status = "expired";
      await ticket.save();
      throw new Error("Ticket expired");
    }
  }

  static async generateTicketsForAllocation(allocation, ticketType) {
    const tickets = [];
    const expiryDate = new Date(
      new Date().getTime() + ticketType.expiryDuration * 60 * 24 * 60 * 1000
    );

    function biasedRandomNumber() {
      let biasThreshold;

      if (ticketType.name === "Daily Draws") biasThreshold = 0.94; // 94% biased
      if (ticketType.name === "Weekly Draws") biasThreshold = 0.96; // 96% biased
      if (ticketType.name === "Monthly Draws") biasThreshold = 0.98; // 98% biased

      if (Math.random() < biasThreshold) {
        // Generate a number less than 10% of the ticket price
        return Math.floor(Math.random() * (ticketType.price / 10));
      } else {
        // Generate a number between 10% and 200% of the ticket price
        return Math.floor(
          Math.random() * (ticketType.price * 2) + ticketType.price / 10
        );
      }
    }

    for (let i = allocation.startRange; i <= allocation.endRange; i++) {
      tickets.push({
        ticketNumber: i,
        ticketType: ticketType._id,
        shop: allocation.shop,
        status: "available",
        expiryDate,
        winningAmount: biasedRandomNumber(),
        price: ticketType.price,
      });
    }

    return Ticket.insertMany(tickets);
  }
}

export default TicketService;
