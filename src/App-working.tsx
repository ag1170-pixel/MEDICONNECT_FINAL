import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme.tsx";

// Direct imports instead of lazy loading to avoid deployment issues
import Home from "./pages/Home";
import Search from "./pages/Search";
import DoctorProfile from "./pages/DoctorProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BookingFlow from "./pages/BookingFlow";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import HealthDashboard from "./pages/HealthDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Devices from "./pages/Devices";
import RingSubscription from "./pages/RingSubscription";
import Medicine from "./pages/Medicine";
import LabTests from "./pages/LabTests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Loading MediConnect...</p>
      </div>
    </div>
  );
}

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/doctor/:id" element={<DoctorProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book/:doctorId" element={<BookingFlow />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/account" element={<Account />} />
              <Route path="/subscription-success" element={<SubscriptionSuccess />} />
              <Route path="/health-dashboard" element={<HealthDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/ring-subscription" element={<RingSubscription />} />
              <Route path="/medicine" element={<Medicine />} />
              <Route path="/lab-tests" element={<LabTests />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
