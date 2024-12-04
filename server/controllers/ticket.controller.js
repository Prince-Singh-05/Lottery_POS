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
    const shops = req.user.shop; // Array of shop IDs
    const startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

    const ticketStats = await Ticket.aggregate([
      {
        $match: {
          shop: { $in: shops },
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
                _id: {
                  status: "$status",
                  shop: "$shop"
                },
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
            },
            {
              $group: {
                _id: "$_id.status",
                shops: {
                  $push: {
                    shop: "$_id.shop",
                    count: "$count",
                    totalAmount: "$totalAmount"
                  }
                },
                totalCount: { $sum: "$count" },
                totalAmount: { $sum: "$totalAmount" }
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
                _id: "$shop",
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
            },
            {
              $group: {
                _id: null,
                shops: {
                  $push: {
                    shop: "$_id",
                    totalClaimed: "$totalClaimed",
                    totalWinningAmount: "$totalWinningAmount",
                    claimedTickets: "$claimedTickets"
                  }
                },
                totalClaimed: { $sum: "$totalClaimed" },
                totalWinningAmount: { $sum: "$totalWinningAmount" }
              }
            }
          ],
          shopDetails: [
            {
              $group: {
                _id: "$shop",
                totalTickets: { $sum: 1 },
                revenue: {
                  $sum: {
                    $cond: [
                      { $or: [
                        { $eq: ["$status", "sold"] },
                        { $eq: ["$status", "claimed"] }
                      ]},
                      "$price",
                      0
                    ]
                  }
                },
                payouts: {
                  $sum: {
                    $cond: [
                      { $eq: ["$status", "claimed"] },
                      "$winningAmount",
                      0
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    // Prepare the response data
    const stats = ticketStats[0];
    const byStatus = stats.byStatus || [];
    const claimedInfo = stats.claimedDetails[0] || {
      shops: [],
      totalClaimed: 0,
      totalWinningAmount: 0
    };
    const shopStats = stats.shopDetails || [];

    // Calculate overall summary
	const totalRevenue = calculateTotalRevenue(shopStats);
	const totalPayouts = calculateTotalPayouts(shopStats);
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
        byShop: claimedInfo.shops
      },
      shopStats: shopStats.map(shop => ({
        shopId: shop._id,
        totalTickets: shop.totalTickets,
        revenue: shop.revenue,
        payouts: shop.payouts,
        netProfit: shop.revenue - shop.payouts
      }))
    };

    res.status(200).json(report);
  } catch (error) {
    console.log(`Error in getWeeklyReport: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getCustomerReport = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all tickets purchased by the customer
    const purchasedTickets = await Ticket.find({ 
      soldTo: userId 
    }).populate('ticketType');

    // Get all claimed tickets by the customer
    const claimedTickets = purchasedTickets.filter(ticket => 
      ticket.status === 'claimed'
    );

    // Calculate total purchase amount
    const totalPurchaseAmount = purchasedTickets.reduce((total, ticket) => 
      total + ticket.ticketType.price, 0
    );

    // Calculate total winning amount
    const totalWinningAmount = claimedTickets.reduce((total, ticket) => 
      total + ticket.winningAmount, 0
    );

    const report = {
      totalTicketsPurchased: purchasedTickets.length,
      totalTicketsClaimed: claimedTickets.length,
      totalPurchaseAmount,
      totalWinningAmount,
      netAmount: totalWinningAmount - totalPurchaseAmount,
      tickets: {
        purchased: purchasedTickets.map(ticket => ({
          ticketNumber: ticket.ticketNumber,
          purchaseDate: ticket.soldAt,
          price: ticket.ticketType.price,
          status: ticket.status,
          type: ticket.ticketType.name
        })),
        claimed: claimedTickets.map(ticket => ({
          ticketNumber: ticket.ticketNumber,
          claimDate: ticket.claimedAt,
          winningAmount: ticket.winningAmount,
          type: ticket.ticketType.name
        }))
      }
    };

    res.status(200).json(report);
  } catch (error) {
    console.error('Error in getCustomerReport:', error);
    res.status(500).json({ 
      message: "Failed to generate customer report",
      error: error.message 
    });
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
  getCustomerReport,
};
