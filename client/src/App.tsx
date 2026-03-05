import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Role Dashboards
import UserDashboard from "./pages/user/UserDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import VerificationDashboard from "./pages/verification/VerificationDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            {/* User (Customer) Routes */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['User']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user/*" element={
              <ProtectedRoute allowedRoles={['User']}>
                <UserDashboard />
              </ProtectedRoute>
            } />

            {/* Service Provider Routes */}
            <Route path="/provider" element={
              <ProtectedRoute allowedRoles={['ServiceProvider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            } />
            <Route path="/provider/*" element={
              <ProtectedRoute allowedRoles={['ServiceProvider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            } />

            {/* Provider Manager Routes */}
            <Route path="/manager" element={
              <ProtectedRoute allowedRoles={['ProviderManager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/manager/*" element={
              <ProtectedRoute allowedRoles={['ProviderManager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />

            {/* Verification Manager Routes */}
            <Route path="/verification" element={
              <ProtectedRoute allowedRoles={['VerificationManager']}>
                <VerificationDashboard />
              </ProtectedRoute>
            } />
            <Route path="/verification/*" element={
              <ProtectedRoute allowedRoles={['VerificationManager']}>
                <VerificationDashboard />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
