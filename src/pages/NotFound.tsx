import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Stethoscope, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full text-center"
      >
        {/* Floating 404 Icon */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="text-8xl font-black bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"
            >
              404
            </motion.div>
            
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1.2, 1.4, 1.2],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
              className="absolute inset-0 blur-2xl bg-primary/20"
            />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            The page <code className="bg-muted px-2 py-1 rounded text-primary font-mono text-sm">{location.pathname}</code> doesn't exist.
          </p>
          <p className="text-muted-foreground">
            It might have been moved, deleted, or you might have typed the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary-hover transition-colors shadow-lg hover:shadow-xl"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-2xl font-medium hover:bg-muted/80 transition-colors border border-border hover:border-border/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-2xl font-medium hover:from-primary/20 hover:to-primary/10 transition-all border border-primary/20 hover:border-primary/40"
            >
              <Search className="h-4 w-4" />
              Find a Doctor
            </Link>
          </motion.div>
        </motion.div>

        {/* MediConnect Brand */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 flex items-center justify-center gap-3"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center"
          >
            <Stethoscope className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            MediConnect
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
