"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";

// Fallback dummy products if the import fails or to keep it fast
const products = [
  { name: "Legal AI Automator", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Real Estate Growth Agent", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Finance Protocol X", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=200&h=200" },
];

const names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Arjun", "Kavya", "Alex", "David", "Sarah"];
const locations = ["Mumbai", "Bengaluru", "Delhi", "Hyderabad", "Pune", "Chennai", "San Francisco", "London", "Berlin"];
const timeAgo = ["just now", "2 minutes ago", "5 minutes ago", "12 minutes ago", "1 hour ago", "3 hours ago"];

interface NotificationData {
  name: string;
  location: string;
  productName: string;
  productImage: string;
  time: string;
}

export function LiveSalesNotification() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const generateNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomTime = timeAgo[Math.floor(Math.random() * timeAgo.length)];

      setCurrentNotification({
        name: randomName,
        location: randomLocation,
        productName: randomProduct.name,
        productImage: randomProduct.image,
        time: randomTime,
      });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const initialTimer = setTimeout(() => {
      generateNotification();
      
      const intervalTimer = setInterval(() => {
        generateNotification();
      }, Math.floor(Math.random() * 10000) + 15000); // Trigger every 15-25 seconds for HIGH FOMO
      
      return () => clearInterval(intervalTimer);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 left-6 z-50 bg-[#0a0c10]/95 backdrop-blur-xl rounded-xl shadow-[0_0_30px_rgba(255,107,53,0.15)] border border-primary/20 p-3 hidden md:flex gap-4 max-w-sm pointer-events-none"
        >
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-white/10 bg-black relative">
            <img 
              src={currentNotification.productImage} 
              alt={currentNotification.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
              <span className="font-semibold text-white">{currentNotification.name}</span>
              <span>in</span>
              <span className="font-semibold text-white inline-flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-primary" />
                {currentNotification.location}
              </span>
            </div>
            <p className="text-sm font-bold leading-tight bg-gradient-to-r from-primary to-[#FF8C61] bg-clip-text text-transparent line-clamp-1">
              Purchased {currentNotification.productName}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-[#4ECDC4]" />
              <span className="text-[10px] text-[#4ECDC4] font-bold uppercase tracking-wider">Verified Purchase • {currentNotification.time}</span>
            </div>
          </div>
          {/* Subtle animated border glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-[#FF8C61]/20 blur-md -z-10 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
