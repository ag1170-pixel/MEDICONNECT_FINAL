import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BookingFlow = lazy(() => import("./pages/BookingFlow"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Account = lazy(() => import("./pages/Account"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const HealthDashboard = lazy(() => import("./pages/HealthDashboard"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const Devices = lazy(() => import("./pages/Devices"));
const RingSubscription = lazy(() => import("./pages/RingSubscription"));
const Medicine = lazy(() => import("./pages/Medicine"));
const LabTests = lazy(() => import("./pages/LabTests"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <motion.div
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4"
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </motion.div>
        <p className="text-sm text-muted-foreground">Loading MediConnect…</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
        <Route path="/doctor/:id" element={<PageWrapper><DoctorProfile /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/book/:doctorId" element={<PageWrapper><BookingFlow /></PageWrapper>} />
        <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
        <Route path="/account" element={<PageWrapper><Account /></PageWrapper>} />
        <Route path="/subscription-success" element={<PageWrapper><SubscriptionSuccess /></PageWrapper>} />
        <Route path="/health-dashboard" element={<PageWrapper><HealthDashboard /></PageWrapper>} />
        <Route path="/doctor-dashboard" element={<PageWrapper><DoctorDashboard /></PageWrapper>} />
        <Route path="/devices" element={<PageWrapper><Devices /></PageWrapper>} />
        <Route path="/ring-subscription" element={<PageWrapper><RingSubscription /></PageWrapper>} />
        <Route path="/medicine" element={<PageWrapper><Medicine /></PageWrapper>} />
        <Route path="/lab-tests" element={<PageWrapper><LabTests /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
