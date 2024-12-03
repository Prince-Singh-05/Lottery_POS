import express from "express";
import { admin, auth, shopOwner } from "../middleware/auth.middleware.js";
import {
	buyTicket,
	getAllTickets,
	getWeeklyReport,
	processWinningTicket,
} from "../controllers/ticket.controller.js";
import { createTicketType, getTicketTypes } from "../controllers/ticketType.controller.js";
import {
	allocateTicketsToShop,
	getShopAllocations,
} from "../controllers/ticketAllocation.controller.js";

const ticketRouter = express.Router();

// Sell tickets and Report
ticketRouter.post("/buy", auth, buyTicket);
ticketRouter.get("/claim/:ticketId", auth, processWinningTicket);
ticketRouter.get("/weeklyReport", auth, shopOwner, getWeeklyReport);

// Create ticket type and Allocate tickets to shop
ticketRouter.post("/createTicketType", auth, admin, createTicketType);
ticketRouter.post("/allocateTickets", auth, admin, allocateTicketsToShop);
ticketRouter.get("/shopAllocations", auth, shopOwner, getShopAllocations);

ticketRouter.get("/", auth, getAllTickets);
ticketRouter.get("/ticket-types", auth, getTicketTypes);

export default ticketRouter;
