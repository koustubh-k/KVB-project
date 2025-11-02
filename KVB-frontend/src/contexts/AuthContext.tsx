import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { AuthContextType, Customer, Worker, Admin, Sales } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Customer | Worker | Admin | Sales | null>(
    null
  );
  const [userType, setUserType] = useState<
    "customer" | "worker" | "admin" | "sales" | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("user");
    const storedUserType = localStorage.getItem("userType");

    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType as "customer" | "worker" | "admin" | "sales");
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    type: "customer" | "worker" | "admin" | "sales"
  ) => {
    try {
      setLoading(true);
      let response;

      switch (type) {
        case "customer":
          response = await authAPI.customerLogin({ email, password });
          break;
        case "worker":
          response = await authAPI.workerLogin({ email, password });
          break;
        case "admin":
          response = await authAPI.adminLogin({ email, password });
          break;
        case "sales":
          response = await authAPI.salesLogin({ email, password });
          break;
        default:
          throw new Error("Invalid user type");
      }

      const userData = response.data;
      setUser(userData);
      setUserType(type);

      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userType", type);

      toast.success(`Welcome back, ${userData.fullName}!`);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    data: any,
    type: "customer" | "worker" | "admin" | "sales"
  ) => {
    try {
      setLoading(true);
      let response;

      switch (type) {
        case "customer":
          response = await authAPI.customerSignup(data);
          break;
        case "worker":
          response = await authAPI.workerSignup(data);
          break;
        case "admin":
          response = await authAPI.adminSignup(data);
          break;
        case "sales":
          response = await authAPI.salesSignup(data);
          break;
        default:
          throw new Error("Invalid user type");
      }

      const userData = response.data;
      setUser(userData);
      setUserType(type);

      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userType", type);

      toast.success(`Welcome, ${userData.fullName}!`);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Call appropriate logout endpoint
      switch (userType) {
        case "customer":
          await authAPI.customerLogout();
          break;
        case "worker":
          await authAPI.workerLogout();
          break;
        case "admin":
          await authAPI.adminLogout();
          break;
        case "sales":
          await authAPI.salesLogout();
          break;
      }
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
    } finally {
      // Clear local state
      setUser(null);
      setUserType(null);
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      setLoading(false);
      toast.success("Logged out successfully");
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
