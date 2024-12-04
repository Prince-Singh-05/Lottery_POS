import React, { useEffect, useState } from 'react';
import useShopStore from '../../stores/shopStore';
import { Button } from '../../components/ui/button';

const ShopManagement = () => {
  const { shops, loading, error, fetchMyShops, registerShop } = useShopStore();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    registrationId: '',
    address: '',
  });

  useEffect(() => {
    fetchMyShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerShop(formData);
      setFormData({
        name: '',
        registrationId: '',
        address: '',
      });
      setShowRegisterForm(false);
    } catch (err) {
      console.error('Error registering shop:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Shops</h1>
        <Button
          onClick={() => setShowRegisterForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Register New Shop
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Register Shop Form */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Register New Shop</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Registration ID
                </label>
                <input 
                  type="text"
                  value={formData.registrationId}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationId: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-100"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shops List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4 p-6">
          {shops.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              No shops registered yet.
            </div>
          ) : (
            shops.map((shop) => (
              <div
                key={shop._id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                      {shop.name}
                    </h3>
                    <p className="text-gray-600 mt-1 capitalize">{shop.address}</p>
                    
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase">ID: {shop.registrationId}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;
