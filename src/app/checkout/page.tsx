"use client";

import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Check, Lock, Truck, ShieldCheck, CreditCard } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    const id = requestAnimationFrame(() => setIsClient(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
    setIsProcessing(true);
    try {
      // Step 1: Create Plural order on the server
      const res = await fetch('/api/plural/create-order', {
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
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        alert('Payment setup failed: ' + (data.error || 'Unknown error'));
        setIsProcessing(false);
        return;
      }

      // Step 2: Save cart to localStorage for success page
      localStorage.setItem('last_purchase', JSON.stringify(items));
      localStorage.setItem('pending_order_id', data.orderId);
      clearCart();

      // Step 3: Redirect to Plural Pine Labs payment gateway
      window.location.href = data.paymentUrl;

    } catch (err) {
      console.error('Checkout error:', err);
      alert('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isClient) return null;

  const inputClass = (field: string) =>
    `w-full bg-black/50 border ${errors[field] ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 focus:border-primary/50 focus:outline-none transition-colors`;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </Link>
          <h1 className="text-xl font-bold tracking-widest uppercase glowing-text">Secure Checkout</h1>
          <div className="w-24" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 -z-10" />
              {[1, 2, 3].map((s) => (
                <div key={s} className={`relative flex flex-col items-center gap-2 ${step >= s ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${step >= s ? "bg-black border-primary shadow-[0_0_15px_rgba(66,133,244,0.3)]" : "bg-black border-white/10"}`}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className="text-xs uppercase font-bold tracking-wider bg-black px-2">
                    {s === 1 ? "Identity" : s === 2 ? "Logistics" : "Payment"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Identity */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6">Identity Verification</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="checkout-first-name" className="text-xs uppercase tracking-wider text-muted-foreground">First Name</label>
                    <input id="checkout-first-name" name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className={inputClass('firstName')} placeholder="John" />
                    {errors.firstName && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="checkout-last-name" className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</label>
                    <input id="checkout-last-name" name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className={inputClass('lastName')} placeholder="Doe" />
                    {errors.lastName && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.lastName}</p>}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label htmlFor="checkout-email" className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <input id="checkout-email" name="email" value={formData.email} onChange={handleInputChange} type="email" className={inputClass('email')} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.email}</p>}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label htmlFor="checkout-phone" className="text-xs uppercase tracking-wider text-muted-foreground">Mobile Number (WhatsApp/SMS)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">+91</span>
                        <input 
                            id="checkout-phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            type="tel" 
                            className={`${inputClass('phone')} pl-12`} 
                            placeholder="9999999999" 
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.phone}</p>}
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed">Required for secure transaction verification via Pine Labs.</p>
                  </div>
                </div>
                <Button id="checkout-step1-next" className="mt-8 w-full" size="lg" onClick={() => validateStep(1) && setStep(2)}>
                  Proceed to Logistics
                </Button>
              </motion.div>
            )}

            {/* Step 2: Logistics */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6">Logistics Configuration</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="checkout-address" className="text-xs uppercase tracking-wider text-muted-foreground">Billing Address</label>
                    <input id="checkout-address" name="address" value={formData.address} onChange={handleInputChange} type="text" className={inputClass('address')} placeholder="123 Main Street" />
                    {errors.address && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="checkout-city" className="text-xs uppercase tracking-wider text-muted-foreground">City</label>
                      <input id="checkout-city" name="city" value={formData.city} onChange={handleInputChange} type="text" className={inputClass('city')} placeholder="New Delhi" />
                      {errors.city && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="checkout-zip" className="text-xs uppercase tracking-wider text-muted-foreground">Zip Code</label>
                      <input id="checkout-zip" name="zip" value={formData.zip} onChange={handleInputChange} type="text" className={inputClass('zip')} placeholder="110001" />
                      {errors.zip && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.zip}</p>}
                    </div>
                  </div>
                  <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-center gap-4">
                    <Truck className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <p className="font-bold">Instant Digital Delivery</p>
                      <p className="text-xs text-muted-foreground">All products delivered instantly to your email after payment</p>
                    </div>
                    <div className="ml-auto font-bold text-green-400">Free</div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button id="checkout-step2-back" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button id="checkout-step2-next" className="flex-1" size="lg" onClick={() => validateStep(2) && setStep(3)}>Proceed to Payment</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment — PCI-Safe Stripe Redirect */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6">Payment Authorization</h2>

                <div className="space-y-4 mb-8">
                  {/* Stripe Shield */}
                  <div className="p-6 border border-primary/20 bg-primary/5 rounded-xl flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-1">Secured by Pine Labs (Plural)</p>
                      <p className="text-sm text-muted-foreground">
                        Your payment is processed by Pine Labs via deep-encryption protocols.
                        We never store or see your financial credentials.
                      </p>
                    </div>
                  </div>

                  {/* Order summary */}
                  <div className="p-4 border border-white/10 rounded-xl bg-black/30 space-y-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Order Summary</p>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-4">{item.name} ×{item.quantity}</span>
                        <span className="font-mono font-bold shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span>Visa · Mastercard · Amex · UPI · Net Banking · Wallets</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button id="checkout-step3-back" variant="ghost" onClick={() => setStep(2)} disabled={isProcessing}>Back</Button>
                  <Button
                    id="checkout-confirm-order"
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={handleConfirmOrder}
                    isLoading={isProcessing}
                  >
                    <Lock className="w-4 h-4 mr-2" />Pay ₹{total.toLocaleString('en-IN')} Securely
                  </Button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-zinc-900/50 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Order Manifest</h3>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {items.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4 text-xs italic">Manifest Empty</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-14 w-14 relative rounded overflow-hidden bg-white/5 border border-white/10 shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-xs">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="font-bold text-xs text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Delivery</span><span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10 mt-2">
                  <span>Total</span>
                  <span className="text-primary glowing-text">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
