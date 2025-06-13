import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LightBeamLine() {
  const [beamProgress, setBeamProgress] = useState(0);

  // Simulate beam drawing with timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setBeamProgress(1);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
      {/* Main vertical line (straight down the middle) */}
      <div className="absolute left-1/2 top-[10%] transform -translate-x-1/2">
        <motion.div 
          className="w-[2px] h-[320px] bg-gradient-to-b from-emerald-500 to-transparent"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.8 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Left line (connects to first skill - 10%) */}
      <motion.div 
        className="absolute left-[12.5%] top-[48%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="h-[2px] w-[70px] bg-gradient-to-r from-emerald-500 to-transparent" />
        <div className="absolute top-0 left-0 h-[120px] w-[2px] bg-gradient-to-b from-emerald-500 to-transparent" />
      </motion.div>

      {/* Left-middle line (connects to second skill - 30%) */}
      <motion.div 
        className="absolute left-[31.2%] top-[48%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="h-[2px] w-[70px] bg-gradient-to-r from-emerald-500 to-transparent" />
        <div className="absolute top-0 left-0 h-[120px] w-[2px] bg-gradient-to-b from-emerald-500 to-transparent" />
      </motion.div>


      {/* Right-middle line (connects to fourth skill - 70%) */}
      <motion.div 
        className="absolute right-[30%] top-[48%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="h-[2px] w-[70px] ml-auto bg-gradient-to-l from-emerald-500 to-transparent" />
        <div className="absolute top-0 right-0 h-[120px] w-[2px] bg-gradient-to-b from-emerald-500 to-transparent" />
      </motion.div>

      {/* Right line (connects to fifth skill - 90%) */}
      <motion.div 
        className="absolute right-[10%] top-[48%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="h-[2px] w-[70px] ml-auto bg-gradient-to-l from-emerald-500 to-transparent" />
        <div className="absolute top-0 right-0 h-[120px] w-[2px] bg-gradient-to-b from-emerald-500 to-transparent" />
      </motion.div>

      {/* Decorative dots (optional) */}
      <motion.div
        className="absolute left-[20%] top-[20%] w-2 h-2 rounded-full bg-emerald-400/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />
      <motion.div
        className="absolute right-[25%] top-[15%] w-2 h-2 rounded-full bg-emerald-400/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      />
      <motion.div
        className="absolute right-[10%] top-[25%] w-1 h-1 rounded-full bg-emerald-400/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      />
    </div>
  );
} 