"use client";

import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Check, Lock, Truck, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { load } from "@cashfreepayments/cashfree-js";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashfree, setCashfree] = useState<unknown>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsClient(true));
    const initCashfree = async () => {
      const mode = (process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" || process.env.NEXT_PUBLIC_CASHFREE_ENV === "PROD") 
        ? "production" 
        : "sandbox";
      
      const cf = await load({ mode: mode as "sandbox" | "production" });
      setCashfree(cf);
    };
    initCashfree();

    // Meta Pixel InitiateCheckout
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: total,
        currency: 'INR',
        content_ids: items.map(i => i.id),
        content_type: 'product',
        num_items: items.length
      });
    }

    return () => cancelAnimationFrame(id);
  }, [items, total]);

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
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "10-digit number required";
    } else if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = "Required";
      if (!formData.city.trim()) newErrors.city = "Required";
      if (!formData.zip.trim()) newErrors.zip = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (!cashfree) {
      alert("Payment system initializing. Please wait.");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Step 1: Create Cashfree order on the server
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          customer: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone || '9999999999',
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentSessionId) {
        alert('Payment setup failed: ' + (data.error || 'Unknown error'));
        setIsProcessing(false);
        return;
      }

      // Step 2: Save cart to localStorage for success page
      localStorage.setItem('last_purchase', JSON.stringify(items));
      localStorage.setItem('pending_order_id', data.orderId);
      clearCart();

      // Step 3: Initiate Cashfree Checkout
      (cashfree as any).checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self", 
      });

    } catch (err) {
      console.error('Checkout error:', err);
      alert('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };


  if (!isClient) return null;

  const inputClass = (field: string) =>
    `w-full bg-[#050505] border ${errors[field] ? 'border-red-500' : 'border-white/5'} rounded-none p-4 focus:border-primary/50 focus:outline-none transition-colors font-black uppercase italic tracking-tighter text-sm`;

  return (
    <div className="min-h-screen bg-background text-white relative overflow-hidden font-inter">
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <header className="flex items-center justify-between mb-24 border-b border-white/5 pb-8">
          <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white transition-all uppercase tracking-[0.3em] font-black text-[10px] italic">
            <ArrowLeft className="w-4 h-4" /> Sync_Return
          </Link>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Checkout_Flow</h1>
            <p className="text-[9px] uppercase tracking-[0.5em] text-primary italic">Secure_Encryption_Active</p>
          </div>
          <div className="w-24 hidden md:block" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-16 relative">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/5 -z-10" />
              {[1, 2, 3].map((s) => (
                <div key={s} className={`relative flex flex-col items-center gap-4 ${step >= s ? "text-primary" : "text-white/20"}`}>
                  <div className={`w-10 h-10 flex items-center justify-center font-black italic text-sm border transition-all duration-500 rounded-none ${step >= s ? "bg-primary border-primary text-black" : "bg-black border-white/5"}`}>
                    {step > s ? <Check className="w-5 h-5" /> : `0${s}`}
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] bg-background px-4 italic">
                    {s === 1 ? "Identity" : s === 2 ? "Logistics" : "Payment"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Identity */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-white/5 p-10 rounded-none backdrop-blur-md">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-10 border-l-4 border-primary pl-6 leading-none">Identity_Auth</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label htmlFor="checkout-first-name" className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black italic">Given_Name</label>
                    <input id="checkout-first-name" name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className={inputClass('firstName')} placeholder="ALEX" />
                    {errors.firstName && <p className="text-red-500 text-[9px] uppercase font-black italic tracking-widest mt-2">Required_Field</p>}
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="checkout-last-name" className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black italic">Surname</label>
                    <input id="checkout-last-name" name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className={inputClass('lastName')} placeholder="WONG" />
                    {errors.lastName && <p className="text-red-500 text-[9px] uppercase font-black italic tracking-widest mt-2">Required_Field</p>}
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label htmlFor="checkout-email" className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black italic">Email_Relay</label>
                    <input id="checkout-email" name="email" value={formData.email} onChange={handleInputChange} type="email" className={inputClass('email')} placeholder="CORE@SWARM.NETWORK" />
                    {errors.email && <p className="text-red-500 text-[9px] uppercase font-black italic tracking-widest mt-2">Invalid_Data_Type</p>}
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label htmlFor="checkout-phone" className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black italic">Comms_Link (Mobile)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black italic text-sm tracking-tighter">+91</span>
                        <input 
                            id="checkout-phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            type="tel" 
                            className={`${inputClass('phone')} pl-14`} 
                            placeholder="9999999999" 
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-[9px] uppercase font-black italic tracking-widest mt-2">Incorrect_Length</p>}
                  </div>
                </div>
                <Button id="checkout-step1-next" className="mt-12 w-full h-14 rounded-none bg-primary hover:bg-white text-black font-black uppercase tracking-[0.3em] italic text-xs" onClick={() => validateStep(1) && setStep(2)}>
                  Proceed_To_Transit
                </Button>
              </motion.div>
            )}

            {/* Step 2: Logistics */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-white/5 p-10 rounded-none backdrop-blur-md">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-10 border-l-4 border-primary pl-6 leading-none">Logistics_Link</h2>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label htmlFor="checkout-address" className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black italic">Locaton_Coordinates</label>
                    <input id="checkout-address" name="address" value={formData.address} onChange={handleInputChange} type="text" className={inputClass('address')} placeholder="STREET_ADDRESS" />
                    {errors.address && <p className="text-red-500 text-[9px] uppercase font-black italic tracking-widest mt-2">Required_Field</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label htmlFor="checkout-city" className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black italic">City_Node</label>
                      <input id="checkout-city" name="city" value={formData.city} onChange={handleInputChange} type="text" className={inputClass('city')} placeholder="NODE_ALPHA" />
                      {errors.city && <p className="text-red-500 text-[9px] uppercase font-black italic tracking-widest mt-2">Required_Field</p>}
                    </div>
                    <div className="space-y-4">
                      <label htmlFor="checkout-zip" className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black italic">Zip_Index</label>
                      <input id="checkout-zip" name="zip" value={formData.zip} onChange={handleInputChange} type="text" className={inputClass('zip')} placeholder="000000" />
                      {errors.zip && <p className="text-red-500 text-[9px] uppercase font-black italic tracking-widest mt-2">Required_Field</p>}
                    </div>
                  </div>
                  <div className="p-6 border border-primary/20 bg-primary/5 rounded-none flex items-center gap-6">
                    <Truck className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <p className="font-black italic uppercase tracking-tighter text-sm">Instant_Digital_Stream</p>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest font-black italic leading-none mt-1">Direct_Relay_To_Inbox_Enabled</p>
                    </div>
                    <div className="ml-auto font-black italic text-primary uppercase text-sm tracking-widest">Free</div>
                  </div>
                </div>
                <div className="flex gap-4 mt-12">
                  <Button id="checkout-step2-back" variant="ghost" className="rounded-none border-white/5 text-white/30 uppercase font-black italic text-[9px] tracking-widest" onClick={() => setStep(1)}>Back</Button>
                  <Button id="checkout-step2-next" className="flex-1 h-14 rounded-none bg-primary hover:bg-white text-black font-black uppercase tracking-[0.3em] italic text-xs" onClick={() => validateStep(2) && setStep(3)}>Finalize_Payment</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-white/5 p-10 rounded-none backdrop-blur-md">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-10 border-l-4 border-primary pl-6 leading-none">Security_Protocol</h2>

                <div className="space-y-8 mb-12">
                  <div className="p-8 border border-primary/10 bg-primary/5 rounded-none flex flex-col items-center gap-6 text-center">
                    <div className="w-20 h-20 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="font-black italic uppercase tracking-tighter text-lg leading-none mb-2">Authenticated_By_Cashfree</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black italic leading-tight max-w-sm">
                        Military_Grade_Encryption_Enabled. <br/> Zero_Knowledge_Credential_Storage.
                      </p>
                    </div>
                  </div>

                  {/* Order summary */}
                  <div className="p-8 border border-white/5 rounded-none bg-black/40 space-y-4">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-black italic border-b border-white/5 pb-4">Order_Summary_v2.4</p>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-end gap-6 italic">
                        <span className="text-white/40 truncate flex-1 font-black uppercase text-[10px] tracking-tighter italic">{item.name} <span className="text-primary font-mono ml-2">(×{item.quantity})</span></span>
                        <span className="font-black text-xs text-white tracking-widest italic shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/5 pt-6 flex justify-between items-end font-black italic uppercase">
                      <span className="text-sm tracking-tighter">Total_Allocation</span>
                      <span className="text-2xl text-primary tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button id="checkout-step3-back" variant="ghost" className="rounded-none border-white/5 text-white/30 uppercase font-black italic text-[9px] tracking-widest" onClick={() => setStep(2)} disabled={isProcessing}>Back</Button>
                  <Button
                    id="checkout-confirm-order"
                    className="flex-1 h-16 rounded-none bg-primary hover:bg-white text-black font-black uppercase tracking-[0.3em] italic text-xs border-none"
                    onClick={handleConfirmOrder}
                    isLoading={isProcessing}
                  >
                    <Lock className="w-4 h-4 mr-3" />Initiate_Payment
                  </Button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-black/60 border border-white/5 p-10 rounded-none backdrop-blur-xl">
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-10 border-b border-white/5 pb-6">Hardware_Manifest</h3>
              <div className="space-y-8 mb-10 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                {items.length === 0 ? (
                  <p className="text-white/20 text-center py-10 text-[9px] font-black uppercase tracking-[0.5em] italic">Null_Stream</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-8 group">
                      <div className="h-20 w-20 relative rounded-none overflow-hidden bg-black border border-white/5 group-hover:border-primary transition-all shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <p className="font-black italic uppercase tracking-tighter text-sm text-white group-hover:text-primary transition-colors truncate">{item.name}</p>
                        <p className="text-[9px] text-white/30 font-black italic uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                        <p className="font-black text-sm text-primary italic mt-2 tracking-tighter">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-white/5 pt-8 space-y-4">
                <div className="flex justify-between text-[10px] font-black italic uppercase tracking-widest text-white/30">
                  <span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black italic uppercase tracking-widest text-white/30">
                  <span>Transit_Fee</span><span className="text-primary italic">0.00</span>
                </div>
                <div className="flex justify-between items-end pt-8 border-t border-white/5 mt-6 font-black italic uppercase">
                  <span className="text-sm tracking-tighter text-white">Total_Allocation</span>
                  <span className="text-4xl text-primary tracking-tighter leading-none">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
