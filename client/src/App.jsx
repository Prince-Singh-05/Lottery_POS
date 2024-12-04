import { useState } from "react";
import { Routes, Route, Link, Navigate, NavLink } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TicketList from "./pages/TicketList";
import TicketTypes from "./pages/admin/TicketTypes";
import ShopManagement from "./pages/shop/ShopManagement";
import WeeklyReport from "./pages/shop/WeeklyReport";
import useUserStore from "./stores/userStore";
import { Button } from "./components/ui/button";
import { Menu, X } from "lucide-react";
import ClaimTickets from "./pages/customer/ClaimTickets";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const { user, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  const NavItems = () => (
    <>
      <Link to="/" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
        Dashboard
      </Link>
      {user.role === "admin" && (
        <>
          <NavLink
            to="/admin/tickets"
            className={({ isActive }) =>
              `text-gray-600 hover:text-gray-900 ${
                isActive ? "font-semibold text-gray-900" : ""
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tickets
          </NavLink>
          <NavLink
            to="/admin/ticket-types"
            className={({ isActive }) =>
              `text-gray-600 hover:text-gray-900 ${
                isActive ? "font-semibold text-gray-900" : ""
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Ticket Types
          </NavLink>
        </>
      )}
      {user.role === "shop_owner" && (
        <>
          <NavLink
            to="/shop/tickets"
            className={({ isActive }) =>
              `text-gray-600 hover:text-gray-900 ${
                isActive ? "font-semibold text-gray-900" : ""
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Tickets
          </NavLink>
          <NavLink
            to="/shop/manage"
            className={({ isActive }) =>
              `text-gray-600 hover:text-gray-900 ${
                isActive ? "font-semibold text-gray-900" : ""
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Shops
          </NavLink>
          <NavLink
            to="/shop/weekly-report"
            className={({ isActive }) =>
              `text-gray-600 hover:text-gray-900 ${
                isActive ? "font-semibold text-gray-900" : ""
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Weekly Report
          </NavLink>
        </>
      )}
      {user.role === "customer" && (
        <>
        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            `text-gray-600 hover:text-gray-900 ${
              isActive ? "font-semibold text-gray-900" : ""
            }`
          }
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Buy Tickets
        </NavLink>
        <NavLink
          to="/tickets/claim"
          className={({ isActive }) =>
            `text-gray-600 hover:text-gray-900 ${
              isActive ? "font-semibold text-gray-900" : ""
            }`
          }
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Claim Tickets
        </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {user && (
        <nav className="bg-white shadow-sm w-full sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="text-xl font-semibold text-gray-800 hover:text-gray-900"
              >
                Lottery POS
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="space-x-4">
                  <NavItems />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 hidden lg:inline">Welcome, {user.name}</span>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {user.role.replace("_", " ").toUpperCase()}
                  </span>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
                <div className="flex flex-col space-y-4 pt-4">
                  <NavItems />
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col space-y-4">
                      <span className="text-gray-600">Welcome, {user.name}</span>
                      <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded w-fit">
                        {user.role.replace("_", " ").toUpperCase()}
                      </span>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        size="sm"
                        className="w-fit"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/auth" element={<Auth />} />

          {/* Customer Routes */}
          <Route
            path="/tickets"
            element={
              <RoleBasedRoute allowedRoles={["customer"]}>
                <TicketList />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/tickets/claim"
            element={
              <RoleBasedRoute allowedRoles={["customer"]}>
                <ClaimTickets />
              </RoleBasedRoute>
            }
          />

          {/* Shop Owner Routes */}
          <Route
            path="/shop/tickets"
            element={
              <RoleBasedRoute allowedRoles={["shop_owner"]}>
                <TicketList mode="shop" />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/shop/manage"
            element={
              <RoleBasedRoute allowedRoles={["shop_owner"]}>
                <ShopManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/shop/weekly-report"
            element={
              <RoleBasedRoute allowedRoles={["shop_owner"]}>
                <WeeklyReport />
              </RoleBasedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/tickets"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <TicketList mode="admin" />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/ticket-types"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <TicketTypes />
              </RoleBasedRoute>
            }
          />

          {/* Dashboard Route */}
          <Route
            path="/"
            element={
              <RoleBasedRoute
                allowedRoles={["admin", "shop_owner", "customer"]}
              >
                <Dashboard />
              </RoleBasedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
