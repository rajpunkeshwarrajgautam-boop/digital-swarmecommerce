"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";
import { products } from "@/lib/data";

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
    // Only run on client
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

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 10 seconds
    const initialTimer = setTimeout(() => {
      generateNotification();
      
      // Then show every 20-35 seconds randomly
      const intervalTimer = setInterval(() => {
        generateNotification();
      }, Math.floor(Math.random() * 15000) + 20000);
      
      return () => clearInterval(intervalTimer);
    }, 10000);

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
          className="fixed bottom-6 left-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 hidden md:flex gap-4 max-w-sm pointer-events-none"
        >
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-gray-100 bg-gray-50 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentNotification.productImage} 
              alt={currentNotification.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
              <span className="font-semibold text-gray-700">{currentNotification.name}</span>
              <span>in</span>
              <span className="font-semibold text-gray-700 inline-flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {currentNotification.location}
              </span>
            </div>
            <p className="text-sm font-bold leading-tight bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent line-clamp-1">
              Purchased {currentNotification.productName}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Verified Purchase • {currentNotification.time}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
