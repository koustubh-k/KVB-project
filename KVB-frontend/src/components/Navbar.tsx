import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ShoppingBag, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getDashboardLink = () => {
    switch (userType) {
      case "admin":
        return "/admin";
      case "worker":
        return "/worker";
      default:
        return "/crm";
    }
  };

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-white">KVB System</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/crm"
              className="flex items-center space-x-1 text-gray-300 hover:text-primary-600 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </Link>

            {user && (
              <Link
                to={getDashboardLink()}
                className="flex items-center space-x-1 text-gray-300 hover:text-primary-600 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-200">{user.fullName}</p>
                    <p className="text-gray-400 capitalize">{userType}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
