import { useState, useEffect } from "react";

export function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const timer = setInterval(() => {
      const currentTime = new Date();
      const difference = target.getTime() - currentTime.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="bg-primary py-1.5 md:py-2 px-4 md:px-6 text-black border-b-2 md:border-b-4 border-black relative overflow-hidden">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 relative z-10">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block bg-black text-primary text-[8px] md:text-[9px] font-black px-2 md:px-3 py-0.5 border border-primary uppercase tracking-[0.2em] italic shrink-0">
            Batch_04
          </div>
          <span className="font-outfit font-black uppercase italic tracking-tighter text-[10px] sm:text-xs md:text-base leading-none text-center sm:text-left">
            Industrial Liquidation: <span className="text-black/60">30% OFF</span>
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-widest opacity-60 italic">Phase_Close:</span>
            <div className="flex items-center gap-1 font-outfit font-black text-xs md:text-xl italic leading-none">
              <span className="bg-black text-white px-1 py-0.5 rounded-sm">{format(timeLeft.days)}D</span>
              <span className="text-black">:</span>
              <span className="bg-black text-white px-1 py-0.5 rounded-sm">{format(timeLeft.hours)}H</span>
              <span className="text-black">:</span>
              <span className="bg-black text-white px-1 py-0.5 rounded-sm">{format(timeLeft.minutes)}M</span>
              <span className="text-black sm:inline hidden">:</span>
              <span className="bg-black text-white px-1 py-0.5 rounded-sm text-accent sm:inline hidden">{format(timeLeft.seconds)}S</span>
            </div>
          </div>

          <button className="hidden md:block bg-black text-white font-outfit font-black uppercase italic px-6 py-1.5 border-2 border-white hover:bg-white hover:text-black transition-all text-xs tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Claim_Access
          </button>
        </div>
      </div>
      
      {/* Background Technical Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
        <div className="whitespace-nowrap text-[60px] md:text-[80px] font-black italic tracking-tighter text-black opacity-20">
          LIQUIDATION LIQUIDATION LIQUIDATION LIQUIDATION
        </div>
      </div>
    </div>
  );
}
