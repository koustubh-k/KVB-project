import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import CRMPage from "@/pages/CRMPage";
import AdminDashboard from "@/pages/AdminDashboard";
import WorkerDashboard from "@/pages/WorkerDashboard";
import SalesDashboard from "@/pages/SalesDashboard";
import LandingPage from "@/pages/LandingPage";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/crm" element={<CRMPage />} />

            {/* Protected routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker"
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute allowedRoles={["sales"]}>
                  <SalesDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
