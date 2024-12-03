import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

const addShop = async (req, res) => {
	try {
		const { name, registrationId, address } = req.body;
		const { _id: userId } = req.user;

		if (!name || !registrationId || !address) {
			return res
				.status(400)
				.json({ message: "Please provide all fields" });
		}

		const shop = await Shop.findOne({ registrationId });
		if (shop) {
			return res.status(400).json({ message: "Shop already exists" });
		}

		const newShop = await Shop.create({
			name,
			registrationId,
			address,
		});

		const shopOwner = await User.findByIdAndUpdate(
			userId,
			{
				$push: { shop: newShop._id },
			},
			{ new: true }
		);

		res.status(201).json(newShop);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getShopDetails = async (req, res) => {
	try {
		const { shopId } = req.params;

		if (!shopId) {
			return res.status(400).json({ message: "Please provide shopId" });
		}
		const shop = await Shop.findOne({ registrationId: shopId });
		if (!shop) {
			return res.status(400).json({ message: "Shop not found" });
		}
		res.status(200).json(shop);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const getAllShops = async (req, res) => {
	try {
		const shops = await Shop.find({});
		res.status(200).json(shops);
	} catch (error) {
		console.log(`Error in getAllShops: ${error.message}`);
		res.status(500).json({ message: error.message });
	}
}

const getMyShops = async (req, res) => {
	try {
		const {_id: userId} = req.user;
		
		const user = await User.findById(userId).populate("shop");
		res.status(200).json(user.shop);
	} catch (error) {
		console.log(`Error in getMyShops: ${error.message}`);
		res.status(500).json({ message: error.message });
	}
}

export { addShop, getShopDetails, getAllShops, getMyShops };
