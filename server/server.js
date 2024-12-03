import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/user.route.js";
import shopRouter from "./routes/shop.route.js";
import ticketRouter from "./routes/ticket.route.js";

connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
	credentials: true,
	origin: "http://localhost:5173"
}));

app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/ticket", ticketRouter);

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
