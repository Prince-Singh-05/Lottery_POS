import Ticket from "../models/ticket.model.js";
import TicketType from "../models/ticketType.model.js";
import User from "../models/user.model.js";
import TicketService from "../services/ticketService.js";
import {
  calculateTotalPayouts,
  calculateTotalRevenue,
} from "../utils/reportUtils.js";

const buyTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("ticketType")
      .exec();

    if (!ticket || ticket.status !== "available") {
      res.status(400).json({
        message: "Ticket not found or already sold",
      });
    }

    // check if ticketNumber is valid or not
    const numericTicketNumber = parseInt(ticket.ticketNumber);
    if (
      numericTicketNumber < ticket.ticketType.numberPattern.startRange ||
      numericTicketNumber > ticket.ticketType.numberPattern.endRange ||
      ticket.ticketNumber.toString().length !==
        ticket.ticketType.numberPattern.digits
    ) {
      return res.status(400).json({ message: "Invalid ticket number" });
    }

    // check if ticket is expired
    // if (ticket.expiryDate < new Date()) {
    // 	ticket.status = "expired";
    // 	await ticket.save();
    // 	res.status(400).json({ message: "Ticket expired" });
    // }

    TicketService.checkTicketExpiry(ticket);

    // updating ticket status to sold
    ticket.status = "sold";
    ticket.soldTo = req.user._id;
    ticket.soldAt = new Date();
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    console.log(`Error in buyTicket: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const processWinningTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("ticketType")
      .exec();

    if (!ticket) {
      return res.status(400).json({
        message: "Ticket not found or not eligible for claiming",
      });
    }

    // check expiry
    // if (new Date() > ticket.expiryDate) {
    //   ticket.status = "expired";
    //   await ticket.save();
    //   return res.status(400).json({ message: "Ticket expired" });
    // }

	TicketService.checkTicketExpiry(ticket);

    ticket.status = "claimed";
    ticket.claimedBy = req.user._id;
    ticket.claimedAt = new Date();
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    console.log(`Error in processWinningTicket: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getWeeklyReport = async (req, res) => {
  try {
    const shop = req.user.shop;
    const startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

    const ticketStats = await Ticket.aggregate([
      {
        $match: {
          shop: shop._id,
          $or: [
            { soldAt: { $gte: startDate } },
            { claimedAt: { $gte: startDate } }
          ]
        }
      },
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: {
                  $sum: {
                    $cond: [
                      { $eq: ["$status", "claimed"] },
                      "$winningAmount",
                      "$price"
                    ]
                  }
                }
              }
            }
          ],
          claimedDetails: [
            {
              $match: {
                status: "claimed",
                claimedAt: { $gte: startDate }
              }
            },
            {
              $group: {
                _id: null,
                totalClaimed: { $sum: 1 },
                totalWinningAmount: { $sum: "$winningAmount" },
                claimedTickets: {
                  $push: {
                    ticketNumber: "$ticketNumber",
                    winningAmount: "$winningAmount",
                    claimedAt: "$claimedAt",
                    claimedBy: "$claimedBy"
                  }
                }
              }
            }
          ]
        }
      }
    ]);

	console.log({ticketStats});

    // Prepare the response data
    const stats = ticketStats[0];
    const byStatus = stats.byStatus || [];
    const claimedInfo = stats.claimedDetails[0] || {
      totalClaimed: 0,
      totalWinningAmount: 0,
      claimedTickets: []
    };

    // calculate summary
    const totalRevenue = calculateTotalRevenue(byStatus);
    const totalPayouts = calculateTotalPayouts(byStatus);
    const netProfit = totalRevenue - totalPayouts;

    const report = {
      period: {
        start: startDate,
        end: new Date(),
      },
      summary: {
        totalRevenue,
        totalPayouts,
        netProfit,
      },
      ticketStats: byStatus,
      claimedTickets: {
        total: claimedInfo.totalClaimed,
        totalAmount: claimedInfo.totalWinningAmount,
        details: claimedInfo.claimedTickets
      }
    };

    res.status(200).json(report);
  } catch (error) {
    console.log(`Error in getWeeklyReport: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getShopTickets = async (req, res) => {
  try {
    const { shopId } = req.params;

    const tickets = await Ticket.find({ shop: shopId }).populate("ticketType");

    res.status(200).json(tickets);
  } catch (error) {
    console.log(`Error in getShopTickets: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).populate("ticketType");

    res.status(200).json(tickets);
  } catch (error) {
    console.log(`Error in getAllTickets: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export {
  buyTicket,
  processWinningTicket,
  getWeeklyReport,
  getShopTickets,
  getAllTickets,
};
