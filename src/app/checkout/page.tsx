"use client";

import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Truck, ShieldCheck, CreditCard, ChevronRight, ArrowLeft, Terminal, Activity } from "lucide-react";
import Image from "next/image";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { useToastStore } from "@/components/ui/ForgeToast";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatCurrency } from "@/lib/utils";
import { trackInitiateCheckout } from "@/components/analytics/FBPixel";
import { ForgeErrorBoundary } from "@/components/ui/ForgeErrorBoundary";
import { trackBeginCheckout } from "@/lib/web-analytics";
import { load as loadCashfree } from "@cashfreepayments/cashfree-js";

export default function CheckoutPage() {
  return (
    <ForgeErrorBoundary>
      <CheckoutContent />
    </ForgeErrorBoundary>
  );
}

function CheckoutContent() {
  const { items, getCartTotal } = useCartStore();
  const { currency } = useCurrency();
  const addToast = useToastStore((s) => s.addToast);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const total = getCartTotal();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (items.length === 0) {
      addToast("WARNING", "MANIFEST_EMPTY", "No assets detected in current buffer. Returning to Registry.");
      router.push("/products");
    }
  }, [isClient, items.length, addToast, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "ID_REQUIRED";
      if (!formData.lastName.trim()) newErrors.lastName = "ID_REQUIRED";
      if (!formData.email.trim()) newErrors.email = "SYNC_REQ";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "SYNC_INVALID";
      if (!formData.phone.trim()) newErrors.phone = "COMMS_REQ";
      else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone)) newErrors.phone = "COMMS_FAULT";
    } else if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = "ZONE_STATED";
      if (!formData.city.trim()) newErrors.city = "T_REF_REQUIRED";
      if (!formData.zip.trim()) newErrors.zip = "S_ZIP_REQUIRED";
      else if (!/^\d{5,6}$/.test(formData.zip)) newErrors.zip = "S_ZIP_FAULT";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      addToast("ERROR", "MATERIALIZATION_FAILURE", "Protocol requirements not satisfied.");
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleCashfreePayment = async () => {
    setIsProcessing(true);
    // Fire FB Pixel InitiateCheckout before gateway opens
    trackInitiateCheckout(total);
    trackBeginCheckout(
      total,
      items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    );
    try {
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          total: total, 
          items, 
          customer: formData,
          currency: currency
        }),
      });
      
      interface CheckoutResponse {
        success?: boolean;
        orderId?: string;
        paymentSessionId?: string;
        cfMode?: string;
        error?: string;
        /** PostgREST / Postgres error code when order persistence fails */
        code?: string;
        message?: string;
      }
      
      const data = (await res.json()) as CheckoutResponse;
      if (!res.ok || data.error) {
        const hint = data.code ? ` (${data.code})` : '';
        const detail = data.message ? ` — ${data.message}` : '';
        throw new Error((data.error || `Order failed (${res.status})`) + hint + detail);
      }

      if (!data.paymentSessionId) {
        throw new Error("GATEWAY_FAULT: Payment Session ID null.");
      }

      const mode = data.cfMode === "production" ? "production" : "sandbox";
      const cashfree = await loadCashfree({ mode });

      if (!cashfree) {
        throw new Error("GATEWAY_FAULT: Cashfree SDK unavailable in this environment.");
      }

      addToast("INFO", "GATEWAY_LINK", "Initialising encrypted payment terminal.");

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "SYSTEM_EXCEPTION: Unhandled transport fault.";
      addToast("ERROR", "UPLINK_CRITICAL_FAULT", message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32 overflow-hidden">
      {/* Forge Grids */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Step Indicator (Forge Style) */}
        <div className="flex items-center gap-6 mb-24 max-w-3xl">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-6 flex-1 group">
               <div className="flex flex-col gap-2">
                 <div className={`w-12 h-12 flex items-center justify-center font-mono font-black border transition-all duration-500 overflow-hidden relative ${step >= s ? "border-primary text-black bg-primary" : "border-white/5 text-white/20 bg-white/2"}`}>
                    <span className="relative z-10">{String(s).padStart(2, '0')}</span>
                    {step === s && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    )}
                 </div>
                 <span className={`text-[8px] font-mono uppercase tracking-[0.3em] transition-colors duration-500 ${step >= s ? "text-primary" : "text-white/10"}`}>
                    {s === 1 ? 'Identity' : s === 2 ? 'Destination' : 'Uplink'}
                 </span>
               </div>
               {s < 3 && (
                 <div className="flex-1 h-px bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: step > s ? 1 : 0 }}
                      className="h-full bg-primary origin-left"
                      transition={{ duration: 0.8, ease: "circOut" }}
                    />
                 </div>
               )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          <div className="lg:col-span-7 space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, transform: 'translateY(20px)' }} 
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0, transform: 'translateY(-20px)' }}
                  className="space-y-12"
                >
                  <header className="space-y-4">
                    <div className="flex items-center gap-4">
                       <Terminal className="w-5 h-5 text-primary" />
                       <h1 className="text-5xl font-outfit font-black uppercase italic tracking-tighter">Customer Registry</h1>
                    </div>
                    <p className="text-white/30 text-[10px] uppercase font-mono tracking-[0.5em] italic">Access_Protocol: STEP_01 // SECURE_UPLINK</p>
                  </header>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase font-black text-white/20 tracking-widest">Given Name</label>
                      <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white/2 border-b border-white/10 p-4 focus:bg-primary/5 focus:border-primary outline-none transition-all uppercase text-xs font-mono font-black tracking-widest text-white placeholder:text-white/5" placeholder="ALEX" />
                      {errors.firstName && <span className="text-primary text-[9px] font-mono uppercase font-black tracking-widest block">{errors.firstName}</span>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase font-black text-white/20 tracking-widest">Surname</label>
                      <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white/2 border-b border-white/10 p-4 focus:bg-primary/5 focus:border-primary outline-none transition-all uppercase text-xs font-mono font-black tracking-widest text-white placeholder:text-white/5" placeholder="WONG" />
                      {errors.lastName && <span className="text-primary text-[9px] font-mono uppercase font-black tracking-widest block">{errors.lastName}</span>}
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-mono uppercase font-black text-white/20 tracking-widest">Sync Point (Email)</label>
                      <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/2 border-b border-white/10 p-4 focus:bg-primary/5 focus:border-primary outline-none transition-all lowercase text-xs font-mono font-black tracking-widest text-white placeholder:text-white/5" placeholder="alex@swarm.infra" />
                      {errors.email && <span className="text-primary text-[9px] font-mono uppercase font-black tracking-widest block">{errors.email}</span>}
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-mono uppercase font-black text-white/20 tracking-widest">Comms Interface (Phone)</label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/2 border-b border-white/10 p-4 focus:bg-primary/5 focus:border-primary outline-none transition-all uppercase text-xs font-mono font-black tracking-widest text-white placeholder:text-white/5" placeholder="+91 00000 00000" />
                      {errors.phone && <span className="text-primary text-[9px] font-mono uppercase font-black tracking-widest block">{errors.phone}</span>}
                    </div>
                  </div>

                  <ForgeButton className="w-full py-8 text-xl" onClick={() => validateStep(1) && setStep(2)}>
                    Authorize Step_02 <ChevronRight className="w-5 h-5 ml-4" />
                  </ForgeButton>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, transform: 'translateY(20px)' }} 
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0, transform: 'translateY(-20px)' }}
                  className="space-y-12"
                >
                  <header className="space-y-4">
                    <div className="flex items-center gap-4 text-primary">
                       <Truck className="w-6 h-6" />
                       <h1 className="text-5xl font-outfit font-black uppercase italic tracking-tighter text-white">Asset Deployment</h1>
                    </div>
                    <p className="text-white/30 text-[10px] uppercase font-mono tracking-[0.5em] italic">Access_Protocol: STEP_02 // LOGISTICS_LINK</p>
                  </header>
                  
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase font-black text-white/20 tracking-widest">Primary Dropzone (Address)</label>
                      <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/2 border-b border-white/10 p-4 focus:bg-primary/5 focus:border-primary outline-none transition-all uppercase text-xs font-mono font-black tracking-widest text-white placeholder:text-white/5" placeholder="SECTOR_07 HACKHOUSE" />
                      {errors.address && <span className="text-primary text-[9px] font-mono uppercase font-black tracking-widest block">{errors.address}</span>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-mono uppercase font-black text-white/20 tracking-widest">Territory (City)</label>
                        <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/2 border-b border-white/10 p-4 focus:bg-primary/5 focus:border-primary outline-none transition-all uppercase text-xs font-mono font-black tracking-widest text-white" placeholder="BENGALURU" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-mono uppercase font-black text-white/20 tracking-widest">Sector_Zip</label>
                        <input name="zip" value={formData.zip} onChange={handleInputChange} className="w-full bg-white/2 border-b border-white/10 p-4 focus:bg-primary/5 focus:border-primary outline-none transition-all uppercase text-xs font-mono font-black tracking-widest text-white" placeholder="560001" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-10 py-5 border border-white/5 bg-white/2 text-[10px] font-mono font-black uppercase tracking-widest text-white/20 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back_Step.01
                    </button>
                    <ForgeButton className="flex-1 py-8 text-xl" onClick={() => validateStep(2) && setStep(3)}>
                      Finalize Uplink <ChevronRight className="w-5 h-5 ml-4" />
                    </ForgeButton>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, transform: 'translateY(20px)' }} 
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0, transform: 'translateY(-20px)' }}
                  className="space-y-12"
                >
                  <header className="space-y-4">
                    <div className="flex items-center gap-4 text-primary">
                       <Activity className="w-6 h-6 animate-pulse" />
                       <h1 className="text-5xl font-outfit font-black uppercase italic tracking-tighter text-white">Registry Uplink</h1>
                    </div>
                    <p className="text-white/30 text-[10px] uppercase font-mono tracking-[0.5em] italic">Access_Protocol: STEP_03 // SIG_REQD</p>
                  </header>
                  
                  <div className="p-10 border border-primary/20 bg-primary/2 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em]">Authorized Payment Interface</span>
                        <div className="h-0.5 w-12 bg-white/10" />
                      </div>
                      <div className="relative h-6 w-32 grayscale brightness-200 contrast-200">
                        <Image 
                          src="https://www.cashfree.com/content/dam/cashfree/logo/cashfree-logo-black.svg" 
                          alt="Cashfree" 
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 mb-12">
                       <p className="text-xs font-mono text-white/40 uppercase leading-loose tracking-widest italic">
                        By initializing the transfer, you acknowledge terms of digital asset acquisition. Provisioning occurs upon successful cryptographic confirmation.
                       </p>
                       <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/60">Layer-4 Encrypted Operations</span>
                       </div>
                    </div>
                    
                    <ForgeButton 
                      className="w-full py-10 text-2xl shadow-[0_20px_80px_rgba(255,107,53,0.3)]" 
                      onClick={handleCashfreePayment} 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-4">
                          <Activity className="w-6 h-6 animate-spin" /> SYNCHRONIZING...
                        </span>
                      ) : (
                        <span className="flex items-center gap-4">
                          <Lock className="w-6 h-6" /> INITIATE_TRANSFER {formatCurrency(total, currency)}
                        </span>
                      )}
                    </ForgeButton>

                    <div className="mt-8 flex justify-center gap-4">
                       <div className="h-px bg-white/5 flex-1 self-center" />
                       <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest whitespace-nowrap">Cashfree_Infrastructure_Sync</span>
                       <div className="h-px bg-white/5 flex-1 self-center" />
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-4 text-[9px] font-mono font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-all underline underline-offset-8"
                  >
                    RETURN_TO_LOGISTICS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary (Forge Glass Panel) */}
          <div className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="bg-white/1 border border-white/5 p-10 backdrop-blur-3xl relative overflow-hidden group">
              {/* Corner Accents */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/10" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/10" />
              
              <h2 className="text-2xl font-outfit font-black uppercase italic tracking-tighter mb-10 pb-4 border-b border-white/10 text-white flex justify-between items-center">
                Manifest_Summary
                <span className="text-[8px] font-mono text-white/20 tracking-widest border border-white/10 px-3 py-1 bg-white/5">v2.04</span>
              </h2>
              
              <div className="space-y-8 mb-16 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-6 group">
                    <div className="w-20 h-20 bg-white/2 border border-white/5 overflow-hidden shrink-0 relative p-1 transition-all group-hover:border-primary/40">
                      <Image src={item.image} alt={item.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="font-outfit font-black text-sm uppercase italic tracking-tight truncate text-white/80 group-hover:text-white transition-colors">{item.name}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">QUANTITY: {String(item.quantity).padStart(2, '0')}</span>
                        <div className="h-3 w-px bg-white/10" />
                        <span className="text-[9px] font-mono text-primary font-black uppercase tracking-widest italic shrink-0">{formatCurrency(item.price * item.quantity, currency)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-5 pt-10 border-t border-white/10">
                <div className="flex justify-between text-[10px] font-mono font-black uppercase tracking-[0.2em] text-white/30">
                  <span>Subtotal_Value</span>
                  <span>{formatCurrency(total, currency)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono font-black uppercase tracking-[0.2em] text-white/30">
                    <span>Provisioning_GST</span>
                    <span className="italic text-primary">0.00_INCLUDED</span>
                </div>
                <div className="flex justify-between items-end mt-10 pt-10 border-t-2 border-primary/20 font-outfit">
                  <span className="text-xl font-black uppercase italic tracking-tighter text-white/40">Grand_Total</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-primary uppercase tracking-widest mb-1 italic">Authorized_{currency}</span>
                    <span className="text-5xl font-black italic tracking-tighter text-primary drop-shadow-[0_0_15px_rgba(255,107,53,0.2)]">{formatCurrency(total, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Secure Marks */}
              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity duration-700">
                 <div className="flex gap-6">
                    <ShieldCheck className="w-4 h-4" />
                    <CreditCard className="w-4 h-4" />
                    <Activity className="w-4 h-4" />
                 </div>
                 <span className="text-[8px] font-mono uppercase tracking-[0.5em] italic">Forge_Encrypted_Protocol_v2</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
