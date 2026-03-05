"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function GeoPricing() {
  const [country, setCountry] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  useEffect(() => {
    // Only check if we haven't checked already
    const checkGeo = async () => {
      try {
        const storedCountry = sessionStorage.getItem("geo_country");
        if (storedCountry) {
          setCountry(storedCountry);
          return;
        }

        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        
        if (data && data.country_name) {
          setCountry(data.country_name);
          setCurrency(data.currency);
          sessionStorage.setItem("geo_country", data.country_name);
          sessionStorage.setItem("geo_currency", data.currency);
        }
      } catch (error) {
        console.error("GeoPricing fetch failed:", error);
      }
    };
    
    checkGeo();
  }, []);

  const isForeign = country && country !== "India";

  return (
    <AnimatePresence>
      {isForeign && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-indigo-900 text-indigo-50 px-4 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium w-full z-50 fixed top-0 left-0"
        >
          <Globe className="w-4 h-4 opacity-70" />
          <span>
            We noticed you&apos;re visiting from <strong>{country}</strong>. 
            All international purchases are adjusted to local Purchasing Power Parity in <strong>{currency || "USD"}</strong> equivalent during checkout.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
