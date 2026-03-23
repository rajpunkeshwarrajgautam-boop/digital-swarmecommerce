"use client";

import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    `w-full bg-white border-4 ${errors[field] ? 'border-red-500 shadow-[6px_6px_0_#ef4444]' : 'border-black shadow-[6px_6px_0_#000]'} rounded-none p-4 focus:bg-[#CCFF00] focus:outline-none transition-all font-black uppercase italic tracking-tighter text-sm`;

  return (
    <div className="min-h-screen bg-[#ffc737] text-black relative overflow-hidden font-inter pt-8">
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <header className="flex items-center justify-between mb-16 border-b-4 border-black pb-8 bg-[#ffc737]">
          <Link href="/" className="flex items-center gap-2 text-black hover:text-black hover:bg-white border-2 border-black px-4 py-2 transition-all uppercase tracking-widest font-black text-xs shadow-[4px_4px_0_#000] italic">
            <ArrowLeft className="w-5 h-5" /> Retreat
          </Link>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none drop-shadow-[4px_4px_0_#fff]">Checkout</h1>
            <p className="text-xs font-black uppercase tracking-widest text-black bg-white border-2 border-black inline-block px-2 italic mt-2 shadow-[2px_2px_0_#000]">Secure_Encryption_Active</p>
          </div>
          <div className="w-24 hidden md:block" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-16 relative">
              <div className="absolute left-0 right-0 top-1/2 h-2 bg-black -z-10" />
              {[1, 2, 3].map((s) => (
                <div key={s} className="relative flex flex-col items-center gap-4 text-black">
                  <div className={`w-14 h-14 flex items-center justify-center font-black italic text-xl border-4 transition-all duration-300 rounded-none shadow-[6px_6px_0_#000] ${step >= s ? "bg-[#CCFF00] border-black text-black" : "bg-white border-black"}`}>
                    {step > s ? <Check className="w-8 h-8 filter drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" /> : `0${s}`}
                  </div>
                  <span className={`text-[10px] uppercase font-black tracking-widest px-4 py-1 border-2 border-black italic shadow-[4px_4px_0_#000] ${step >= s ? "bg-black text-[#ffc737]" : "bg-white text-black"}`}>
                    {s === 1 ? "Identity" : s === 2 ? "Logistics" : "Payment"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Identity */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black shadow-[12px_12px_0_#000] p-10 rounded-none">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-[#a855f7] pl-6 leading-none">Identity_Auth</h2>
                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <label htmlFor="checkout-first-name" className="text-xs uppercase tracking-widest text-black font-black italic">Given_Name</label>
                    <input id="checkout-first-name" name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className={inputClass('firstName')} placeholder="ALEX" />
                    {errors.firstName && <p className="text-red-500 text-xs uppercase font-black italic tracking-widest mt-2 bg-red-500/10 border border-red-500 px-2 py-1 inline-block">Required_Field</p>}
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="checkout-last-name" className="text-xs uppercase tracking-widest text-black font-black italic">Surname</label>
                    <input id="checkout-last-name" name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className={inputClass('lastName')} placeholder="WONG" />
                    {errors.lastName && <p className="text-red-500 text-xs uppercase font-black italic tracking-widest mt-2 bg-red-500/10 border border-red-500 px-2 py-1 inline-block">Required_Field</p>}
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label htmlFor="checkout-email" className="text-xs uppercase tracking-widest text-black font-black italic">Email_Relay</label>
                    <input id="checkout-email" name="email" value={formData.email} onChange={handleInputChange} type="email" className={inputClass('email')} placeholder="CORE@SWARM.NETWORK" />
                    {errors.email && <p className="text-red-500 text-xs uppercase font-black italic tracking-widest mt-2 bg-red-500/10 border border-red-500 px-2 py-1 inline-block">Invalid_Data_Type</p>}
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label htmlFor="checkout-phone" className="text-xs uppercase tracking-widest text-black font-black italic">Comms_Link (Mobile)</label>
                    <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-black/40 font-black italic text-lg tracking-tighter">+91</span>
                        <input 
                            id="checkout-phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            type="tel" 
                            className={`${inputClass('phone')} pl-16`} 
                            placeholder="9999999999" 
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs uppercase font-black italic tracking-widest mt-2 bg-red-500/10 border border-red-500 px-2 py-1 inline-block">Incorrect_Length</p>}
                  </div>
                </div>
                <button 
                  className="w-full h-20 border-4 border-black bg-[#CCFF00] hover:bg-black text-black hover:text-[#CCFF00] font-black uppercase tracking-widest italic text-xl shadow-[6px_6px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all" 
                  onClick={() => {
                    if (validateStep(1)) {
                      setStep(2);
                      // Fire-and-forget covert checkout telemtry
                      fetch('/api/cart/track', {
                        method: 'POST',
                        body: JSON.stringify({ email: formData.email, items, total }),
                        headers: { 'Content-Type': 'application/json' }
                      }).catch(() => {});
                    }
                  }}
                >
                  Proceed_To_Transit -&gt;
                </button>
              </motion.div>
            )}

            {/* Step 2: Logistics */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black shadow-[12px_12px_0_#000] p-10 rounded-none">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-[#22c55e] pl-6 leading-none">Logistics_Link</h2>
                <div className="space-y-8 mb-12">
                  <div className="space-y-4">
                    <label htmlFor="checkout-address" className="text-xs uppercase tracking-widest text-black font-black italic">Location_Coordinates</label>
                    <input id="checkout-address" name="address" value={formData.address} onChange={handleInputChange} type="text" className={inputClass('address')} placeholder="STREET_ADDRESS" />
                    {errors.address && <p className="text-red-500 text-xs uppercase font-black italic tracking-widest mt-2 bg-red-500/10 border border-red-500 px-2 py-1 inline-block">Required_Field</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label htmlFor="checkout-city" className="text-xs uppercase tracking-widest text-black font-black italic">City_Node</label>
                      <input id="checkout-city" name="city" value={formData.city} onChange={handleInputChange} type="text" className={inputClass('city')} placeholder="NODE_ALPHA" />
                      {errors.city && <p className="text-red-500 text-xs uppercase font-black italic tracking-widest mt-2 bg-red-500/10 border border-red-500 px-2 py-1 inline-block">Required_Field</p>}
                    </div>
                    <div className="space-y-4">
                      <label htmlFor="checkout-zip" className="text-xs uppercase tracking-widest text-black font-black italic">Zip_Index</label>
                      <input id="checkout-zip" name="zip" value={formData.zip} onChange={handleInputChange} type="text" className={inputClass('zip')} placeholder="000000" />
                      {errors.zip && <p className="text-red-500 text-xs uppercase font-black italic tracking-widest mt-2 bg-red-500/10 border border-red-500 px-2 py-1 inline-block">Required_Field</p>}
                    </div>
                  </div>
                  <div className="p-6 border-4 border-black bg-[#CCFF00] shadow-[6px_6px_0_#000] flex items-center gap-6">
                    <Truck className="w-10 h-10 text-black shrink-0" />
                    <div>
                      <p className="font-black italic uppercase tracking-tighter text-xl text-black">Instant_Digital_Stream</p>
                      <p className="text-xs text-black/60 uppercase tracking-widest font-black italic leading-none mt-2">Direct_Relay_To_Inbox_Enabled</p>
                    </div>
                    <div className="ml-auto font-black italic text-black bg-white border-2 border-black px-4 py-2 uppercase text-sm tracking-widest shadow-[4px_4px_0_#000] rotate-[-5deg]">Free</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="h-20 px-8 border-4 border-black bg-white text-black hover:bg-black hover:text-white uppercase font-black italic tracking-widest shadow-[6px_6px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all" onClick={() => setStep(1)}><ArrowLeft className="w-6 h-6"/></button>
                  <button className="flex-1 h-20 border-4 border-black bg-[#CCFF00] hover:bg-black text-black hover:text-[#CCFF00] font-black uppercase tracking-widest italic text-xl shadow-[6px_6px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all" onClick={() => validateStep(2) && setStep(3)}>Finalize_Payment -&gt;</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black shadow-[12px_12px_0_#000] p-10 rounded-none">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-[#3b82f6] pl-6 leading-none text-black">Security_Protocol</h2>

                <div className="space-y-8 mb-12">
                  <div className="p-8 border-4 border-black bg-[#CCFF00] shadow-[6px_6px_0_#000] flex flex-col items-center gap-6 text-center">
                    <div className="w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-black" />
                    </div>
                    <div>
                      <p className="font-black italic uppercase tracking-tighter text-2xl leading-none mb-4 text-black bg-white inline-block px-4 py-2 border-2 border-black rotate-[2deg]">Authenticated_By_Cashfree</p>
                      <p className="text-xs text-black/70 uppercase tracking-widest font-black italic leading-tight max-w-sm">
                        Military_Grade_Encryption_Enabled. <br/> Zero_Knowledge_Credential_Storage.
                      </p>
                    </div>
                  </div>

                  {/* Certification Badges */}
                  <div className="flex justify-center flex-wrap gap-8 py-4">
                    <div className="flex flex-col items-center gap-2 p-4 border-2 border-black bg-white shadow-[4px_4px_0_#000]">
                        <Lock className="w-6 h-6 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">SSL_SECURED</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 border-2 border-black bg-white shadow-[4px_4px_0_#000]">
                        <ShieldCheck className="w-6 h-6 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">PCI_COMPLIANT</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 border-2 border-black bg-white shadow-[4px_4px_0_#000]">
                        <Check className="w-6 h-6 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">GST_VERIFIED</span>
                    </div>
                  </div>

                  {/* Order summary mobile */}
                  <div className="p-8 border-4 border-black bg-[#ffc737] shadow-[6px_6px_0_#000] space-y-4 lg:hidden">
                    <p className="text-xs uppercase tracking-[0.3em] text-black font-black italic border-b-4 border-black pb-4">Order_Summary_v2.4</p>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-end gap-6 italic">
                        <span className="text-black truncate flex-1 font-black uppercase tracking-tighter italic">{item.name} <span className="bg-white border-2 border-black ml-2 px-1">(×{item.quantity})</span></span>
                        <span className="font-black text-lg text-black tracking-widest italic shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="border-t-4 border-black pt-6 flex justify-between items-end font-black italic uppercase text-black">
                      <span className="text-lg tracking-tighter">Total_Allocation</span>
                      <span className="text-3xl text-red-500 tracking-tighter drop-shadow-[2px_2px_0_#fff]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="h-20 px-8 border-4 border-black bg-white text-black hover:bg-black hover:text-white uppercase font-black italic tracking-widest shadow-[6px_6px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-1 disabled:translate-y-1" onClick={() => setStep(2)} disabled={isProcessing}><ArrowLeft className="w-6 h-6"/></button>
                  <button
                    id="checkout-confirm-order"
                    className="flex-1 h-20 flex justify-center items-center gap-4 border-4 border-black bg-red-500 hover:bg-black text-white hover:text-red-500 font-black uppercase tracking-widest italic text-xl shadow-[6px_6px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-1 disabled:translate-y-1"
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                  >
                    <Lock className="w-6 h-6" />{isProcessing ? "PROCESSING..." : "Initiate_Payment ->"}
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-24 bg-white border-4 border-black shadow-[12px_12px_0_#000] p-10 rounded-none relative">
              {/* ONO Style tape/sticker accent */}
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-red-500 text-white border-2 border-black font-black uppercase px-4 py-1 italic tracking-widest shadow-[4px_4px_0_#000] rotate-[3deg]">FINAL_REVIEW</div>
              
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 border-b-4 border-black pb-8 text-black">Hardware_Manifest</h3>
              
              <div className="space-y-6 mb-10 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                {items.length === 0 ? (
                  <p className="text-black/30 text-center py-10 text-xs font-black uppercase tracking-[0.3em] italic">Null_Stream</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-6 group p-4 border-4 border-black bg-[#ffc737] shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#CCFF00]">
                      <div className="h-20 w-20 relative rounded-none overflow-hidden border-2 border-black shrink-0 bg-black">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                        <p className="font-black italic uppercase tracking-tighter text-black leading-tight group-hover:text-primary transition-colors truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-[10px] text-black bg-white border-2 border-black px-2 font-black italic uppercase tracking-widest whitespace-nowrap">QTY: {item.quantity}</p>
                          <p className="font-black text-sm text-black italic truncate">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t-4 border-black pt-8 space-y-4">
                <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-black/60">
                  <span>Subtotal</span><span className="text-black">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-black/60">
                  <span>Transit_Fee</span><span className="text-green-600 bg-green-500/10 border border-green-500 px-2 italic">0.00</span>
                </div>
                <div className="flex justify-between items-end pt-8 border-t-4 border-black border-dashed mt-6 font-black italic uppercase bg-[#CCFF00] -mx-10 px-10 pb-10">
                  <span className="text-lg tracking-tighter text-black mt-10">Total_Allocation</span>
                  <span className="text-5xl text-red-500 tracking-tighter leading-none drop-shadow-[2px_2px_0_#fff]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
