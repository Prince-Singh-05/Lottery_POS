import React, { useEffect, useState } from "react";
import useTicketTypeStore from "../../stores/ticketTypeStore";
import useShopStore from "../../stores/shopStore";
import { Button } from "../../components/ui/button";

const TicketTypes = () => {
  const {
    ticketTypes,
    loading: ticketTypesLoading,
    error: ticketTypesError,
    fetchTicketTypes,
    createTicketType,
    allocateTickets,
    availableTypes,
    getDefaultExpiryDuration,
  } = useTicketTypeStore();

  const {
    shops,
    loading: shopsLoading,
    error: shopsError,
    fetchAllShops,
  } = useShopStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "Daily Draws",
    price: "",
    startRange: "",
    endRange: "",
    digits: "",
    expiryDuration: 1,
  });

  const [allocationData, setAllocationData] = useState({
    ticketTypeId: "",
    shopId: "",
    startRange: "",
    endRange: "",
  });

  useEffect(() => {
    fetchTicketTypes();
    fetchAllShops();
  }, []);

  // Update expiry duration when ticket type changes
  const handleTicketTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      name: selectedType,
      expiryDuration: getDefaultExpiryDuration(selectedType),
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicketType({
        ...formData,
        price: parseFloat(formData.price),
        startRange: parseInt(formData.startRange),
        endRange: parseInt(formData.endRange),
        digits: parseInt(formData.digits),
        expiryDuration: parseInt(formData.expiryDuration),
      });
      setFormData({
        name: "Daily Draws",
        price: "",
        startRange: "",
        endRange: "",
        digits: "",
        expiryDuration: 1,
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating ticket type:", err);
    }
  };

  const handleAllocationSubmit = async (e) => {
    e.preventDefault();
    try {
      await allocateTickets({
        ...allocationData,
        startRange: parseInt(allocationData.startRange),
        endRange: parseInt(allocationData.endRange),
      });
      setAllocationData({
        ticketTypeId: "",
        shopId: "",
        startRange: "",
        endRange: "",
      });
      setShowAllocationForm(false);
    } catch (err) {
      console.error("Error allocating tickets:", err);
    }
  };

  if (ticketTypesLoading || shopsLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );

  return (
    <div className="container mx-auto sm:px-6 px-0 py-6">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Ticket Types Management
        </h1>
        <div className="flex flex-col xsm:flex-row gap-3 flex-start space-x-4">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create New Ticket Type
          </Button>
          <Button
            onClick={() => setShowAllocationForm(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={shops.length === 0}
          >
            Allocate Tickets
          </Button>
        </div>
      </div>

      {(ticketTypesError || shopsError) && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {ticketTypesError || shopsError}
        </div>
      )}

      {/* Create Ticket Type Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Create New Ticket Type
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.name}
                  onChange={handleTicketTypeChange}
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                >
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Range
                </label>
                <input
                  type="number"
                  value={formData.startRange}
                  onChange={(e) =>
                    setFormData({ ...formData, startRange: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Range
                </label>
                <input
                  type="number"
                  value={formData.endRange}
                  onChange={(e) =>
                    setFormData({ ...formData, endRange: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No of digits
                </label>
                <input 
                  type="number"
                  value={formData.digits}
                  onChange={(e) => setFormData({...formData, digits: e.target.value})}
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.expiryDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDuration: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Tickets Form */}
      {showAllocationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Allocate Tickets to Shop
            </h2>
            <form onSubmit={handleAllocationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Type
                </label>
                <select
                  value={allocationData.ticketTypeId}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      ticketTypeId: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                >
                  <option value="">Select Ticket Type</option>
                  {ticketTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name} ({type.numberPattern.startRange} - {type.numberPattern.endRange})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop
                </label>
                <select
                  value={allocationData.shopId}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      shopId: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                >
                  <option value="">Select Shop</option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name} - {shop.address}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Number
                </label>
                <input
                  type="number"
                  value={allocationData.startRange}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      startRange: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Number
                </label>
                <input
                  type="number"
                  value={allocationData.endRange}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      endRange: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowAllocationForm(false)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Allocate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Types List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4 p-6">
          {ticketTypes.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              No ticket types found.
            </div>
          ) : (
            <>
              {ticketTypes.map((type) => (
                <div
                  key={type._id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        Expires after: {type.expiryDuration} days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        ${type.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        Range: {type.numberPattern.startRange} - {type.numberPattern.endRange}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketTypes;
