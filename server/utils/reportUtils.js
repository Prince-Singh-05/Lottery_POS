const calculateTotalRevenue = (tickets) => {
	return tickets.reduce((total, ticket) => {
		if (ticket._id === "sold") {
			return total + ticket.totalAmount;
		}
		return total;
	}, 0);
};

const calculateTotalPayouts = (tickets) => {
	return tickets.reduce((total, ticket) => {
		if (ticket._id === "claimed") {
			return total + ticket.totalAmount;
		}
		return total;
	}, 0);
};

export { calculateTotalRevenue, calculateTotalPayouts };
