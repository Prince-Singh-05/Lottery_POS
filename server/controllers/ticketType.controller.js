import TicketType from "../models/ticketType.model.js";
import TicketService from "../services/ticketService.js";

const createTicketType = async (req, res) => {
  try {

    const { name, price, startRange, endRange, digits, expiryDuration } =
      req.body;

    if (
      !name ||
      !startRange ||
      !endRange ||
      !digits ||
      !price ||
      !expiryDuration
    ) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const numberPattern = {
      startRange,
      endRange,
      digits,
    };

    // check range is valid for this ticket type name
    const ticketTypes = await TicketType.find({});

    ticketTypes.forEach((ticketType) => {
      if (
        (startRange >= ticketType.numberPattern.startRange && startRange <= ticketType.numberPattern.endRange) ||
        (endRange >= ticketType.numberPattern.startRange && endRange <= ticketType.numberPattern.endRange) ||
        (startRange <= ticketType.numberPattern.startRange && endRange >= ticketType.numberPattern.endRange)
      ) {
        throw new Error("Ticket ranges overlaps with existing type");
      }
    });

    // create ticket type
    const ticketType = await TicketType.create({
      name,
      numberPattern,
      price,
      expiryDuration,
    });

    res.status(201).json(ticketType);
  } catch (error) {
    console.log(`Error creating ticket type: ${error}`);
    res.status(500).json({
      message: `Error creating ticket type: ${error.message}`,
    });
  }
};

const getTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find({});
    res.status(200).json(ticketTypes);
  } catch (error) {
    console.log(`Error getting ticket types: ${error}`);
    res.status(500).json({
      message: `Error getting ticket types: ${error.message}`,
    });
  }
};

export { createTicketType, getTicketTypes };
