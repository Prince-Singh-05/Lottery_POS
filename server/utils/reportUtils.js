const calculateTotalRevenue = (shopStats) => {
	return shopStats.reduce((sum, shop) => sum + shop.revenue, 0);
};

const calculateTotalPayouts = (shopStats) => {
	return shopStats.reduce((sum, shop) => sum + shop.payouts, 0);
};

export { calculateTotalRevenue, calculateTotalPayouts };
