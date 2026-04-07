import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, User, LogOut, Stethoscope, Activity, Watch,
  Heart, ChevronDown, Menu, X, Moon, Sun, Settings, Shield,
  LayoutDashboard, Cpu, UserCog, Pill, FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Health", href: "/health-dashboard", icon: Heart },
  { label: "Devices", href: "/devices", icon: Cpu },
  { label: "Ring Plans", href: "/ring-subscription", icon: Shield },
  { label: "Medicine", href: "/medicine", icon: Pill },
  { label: "Lab Tests", href: "/lab-tests", icon: FlaskConical },
  { label: "Doctor Panel", href: "/doctor-dashboard", icon: Stethoscope },
  { label: "Account", href: "/account", icon: UserCog },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logged out", description: "See you soon!" });
      navigate("/");
    }
    setProfileOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "backdrop-blur-2xl bg-gray-950/80 border-b border-white/10 shadow-glass"
            : "backdrop-blur-xl bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <motion.div
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-neon"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Activity className="h-5 w-5 text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-green-400"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <span className="text-base font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                MediConnect
              </span>
              <div className="text-xs text-muted-foreground leading-none -mt-0.5 hidden sm:block">
                Health Platform
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link key={link.href} to={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap",
                      active
                        ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{link.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/20 -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <motion.div
              animate={{
                width: searchFocused ? 200 : 160,
                borderColor: searchFocused ? "hsl(187,100%,50%,0.4)" : "rgba(255,255,255,0.1)"
              }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center backdrop-blur-xl bg-white/5 border rounded-xl overflow-hidden"
            >
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent text-xs text-white placeholder-muted-foreground pl-8 pr-2 py-2 outline-none w-full"
              />
            </motion.div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </motion.button>

            {/* Profile Menu */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs text-white hidden lg:block max-w-[80px] truncate">
                    {user.email?.split("@")[0] || "User"}
                  </span>
                  <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, type: "spring", stiffness: 400 }}
                      className="absolute right-0 mt-2 w-52 backdrop-blur-2xl bg-gray-950/90 border border-white/10 rounded-2xl shadow-glass-lg overflow-hidden"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        <p className="text-xs text-cyan-400 mt-0.5">Patient Account</p>
                      </div>

                      {/* Menu items */}
                      <div className="p-2 space-y-1">
                        {[
                          { label: "Account Settings", icon: Settings, href: "/account" },
                          { label: "Health Dashboard", icon: Heart, href: "/health-dashboard" },
                          { label: "My Devices", icon: Watch, href: "/devices" },
                          { label: "Privacy & Security", icon: Shield, href: "/account" },
                        ].map((item) => (
                          <Link key={item.href} to={item.href} onClick={() => setProfileOpen(false)}>
                            <motion.div
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </motion.div>
                          </Link>
                        ))}
                      </div>

                      <div className="p-2 border-t border-white/10">
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                  >
                    Sign in
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 shadow-neon transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4 text-white" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-white/10 backdrop-blur-2xl bg-gray-950/80 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="mb-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-sm text-white placeholder-muted-foreground outline-none flex-1"
                    />
                  </div>
                </form>

                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link to={link.href}>
                        <div className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                          active
                            ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}>
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{link.label}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
