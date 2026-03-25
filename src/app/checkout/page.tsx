"use client";

import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Check, Truck, ChevronRight, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";


export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore();
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
    
    // Load Cashfree SDK
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "Required";
      if (!formData.lastName.trim()) newErrors.lastName = "Required";
      if (!formData.email.trim()) newErrors.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.phone.trim()) newErrors.phone = "Required";
    } else if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = "Required";
      if (!formData.city.trim()) newErrors.city = "Required";
      if (!formData.zip.trim()) newErrors.zip = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCashfreePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          total: total, 
          items, 
          customer: formData 
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const cashfree = new (window as any).Cashfree({
        mode: "sandbox", // Switch to "production" for live
      });

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self" // For consistent experience
      });

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 overflow-hidden font-mono">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-8 mb-16 max-w-2xl">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4 flex-1">
              <div className={`w-10 h-10 flex items-center justify-center font-black border-2 transition-all ${step >= s ? "bg-[#ff6b35] border-[#ff6b35] text-white" : "border-white/10 text-white/20"}`}>
                {s}
              </div>
              <div className="hidden sm:block flex-1 h-[2px] bg-white/5 last:hidden" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <header>
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Contact Details</h1>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Step 01/03 &mdash; Customer Identity</p>
                </header>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-white/40">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-[#ff6b35] outline-none transition-all uppercase text-sm font-bold" placeholder="Alex" />
                    {errors.firstName && <span className="text-primary text-[10px] uppercase font-black">Required</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-white/40">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-[#ff6b35] outline-none transition-all uppercase text-sm font-bold" placeholder="Wong" />
                    {errors.lastName && <span className="text-primary text-[10px] uppercase font-black">Required</span>}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-black text-white/40">Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-[#ff6b35] outline-none transition-all lowercase text-sm font-bold" placeholder="alex@swarm.in" />
                    {errors.email && <span className="text-primary text-[10px] uppercase font-black">{errors.email}</span>}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-black text-white/40">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-[#ff6b35] outline-none transition-all uppercase text-sm font-bold" placeholder="+91 00000 00000" />
                    {errors.phone && <span className="text-primary text-[10px] uppercase font-black">Required</span>}
                  </div>
                </div>

                <Button className="w-full py-8 text-xl font-black uppercase tracking-widest bg-[#ff6b35]" onClick={() => validateStep(1) && setStep(2)}>
                  Continue to Address
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <header>
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Shipping Details</h1>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Step 02/03 &mdash; Asset Destination</p>
                </header>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-white/40">Street Address</label>
                    <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-[#ff6b35] outline-none transition-all uppercase text-sm font-bold" placeholder="123 HACKER ST" />
                    {errors.address && <span className="text-primary text-[10px] uppercase font-black">Required</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-white/40">City</label>
                      <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-[#ff6b35] outline-none transition-all uppercase text-sm font-bold" placeholder="Bangalore" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-white/40">Zip Code</label>
                      <input name="zip" value={formData.zip} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-[#ff6b35] outline-none transition-all uppercase text-sm font-bold" placeholder="560001" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="px-8 border-white/10" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1 py-8 text-xl font-black uppercase tracking-widest bg-[#ff6b35]" onClick={() => validateStep(2) && setStep(3)}>
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <header>
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Finalize Payment</h1>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Step 03/03 &mdash; Signature Required</p>
                </header>
                
                <div className="p-8 border-2 border-[#CCFF00]/20 bg-[#CCFF00]/5 rounded-3xl mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold uppercase tracking-widest">Encrypted Processor</span>
                    <div className="relative h-4 w-24 invert">
                      <Image 
                        src="https://www.cashfree.com/content/dam/cashfree/logo/cashfree-logo-black.svg" 
                        alt="Cashfree" 
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mb-8">Secure UPI, Cards, and NetBanking via Cashfree Operations. Instant provisioning upon success.</p>
                  
                  <div className="flex items-center gap-6 opacity-20 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                    <Lock className="w-6 h-6" /> PAY ₹{total.toLocaleString("en-IN")}
                  </div>
                  
                  <Button className="w-full py-8 text-xl font-black uppercase tracking-widest bg-[#ff6b35] shadow-2xl shadow-[#ff6b35]/20" onClick={handleCashfreePayment} disabled={isProcessing}>
                    {isProcessing ? "INITIALIZING..." : "COMPLETE PURCHASE"}
                  </Button>
                </div>

                <Button variant="ghost" className="w-full text-white/20 hover:text-white" onClick={() => setStep(2)}>Review Information</Button>
              </motion.div>
            )}
          </div>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 pb-4 border-b border-white/10">Order Summary</h2>
              
              <div className="space-y-6 mb-12">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm uppercase italic tracking-tight truncate">{item.name}</p>
                      <p className="text-[10px] text-white/30 uppercase font-black">QTY: {item.quantity}</p>
                    </div>
                    <div className="text-right font-black italic">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                    <span>Tax (GST)</span>
                    <span className="italic text-primary">Inc.</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-xl font-black uppercase italic tracking-tighter">Total</span>
                  <span className="text-4xl font-black italic tracking-tighter text-[#ff6b35]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-8 opacity-20 grayscale grayscale-100">
               {/* Trust Marks */}
               <Check className="w-6 h-6" />
               <Truck className="w-6 h-6" />
               <Lock className="w-6 h-6" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
