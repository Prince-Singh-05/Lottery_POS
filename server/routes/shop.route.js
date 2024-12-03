import express from "express";
import { auth, shopOwner } from "../middleware/auth.middleware.js";
import { addShop, getAllShops, getMyShops, getShopDetails } from "../controllers/shop.controller.js";
import { getShopTickets } from "../controllers/ticket.controller.js";

const shopRouter = express.Router();

shopRouter.get("/", auth, getAllShops);
shopRouter.get("/my-shops", auth, shopOwner, getMyShops);

shopRouter.post("/register", auth, shopOwner, addShop);
shopRouter.get("/:shopId/details", auth, getShopDetails);
shopRouter.get("/:shopId/tickets", auth, getShopTickets);


export default shopRouter;
