import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
	try {
		const token = req.headers["authorization"]?.split(" ")[1] || req?.cookies?.token;

		if (!token) {
			return res
				.status(400)
				.json({ message: "Unauthorized, No token provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded._id)
			.select("-password")
			.populate("shop");

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const admin = async (req, res, next) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(400).json({ message: "Unauthorized" });
		}
		next();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const shopOwner = async (req, res, next) => {
	try {
		if (req.user.role !== "shop_owner") {
			return res.status(400).json({ message: "Unauthorized" });
		}
		next();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export { auth, admin, shopOwner };
