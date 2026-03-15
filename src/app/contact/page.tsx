"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.message.trim()) newErrors.message = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg bg-zinc-900 border ${errors[field] ? "border-red-500" : "border-white/10"} focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all`;

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground">Have questions about our products? We&apos;re here to help.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">+91 8810777573</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground mb-1">Electronic Correspondence</p>
                    <a href="mailto:support@digitalswarm.in" className="font-medium hover:text-primary transition-colors flex items-center gap-2">
                       support@digitalswarm.in <span className="text-[10px] uppercase border border-primary/30 px-1 rounded text-primary">General</span>
                    </a>
                    <a href="mailto:partnerships@digitalswarm.in" className="text-sm hover:text-primary transition-colors flex items-center gap-2 mt-1">
                       partnerships@digitalswarm.in <span className="text-[10px] uppercase border border-blue-400/30 px-1 rounded text-blue-400">Business</span>
                    </a>
                    <a href="mailto:founder@digitalswarm.in" className="text-sm hover:text-primary transition-colors flex items-center gap-2 mt-1">
                       founder@digitalswarm.in <span className="text-[10px] uppercase border border-amber-400/30 px-1 rounded text-amber-400">Direct</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Office</p>
                    <p className="font-medium">Cyber City Innovation Hub,<br />Gurugram, India 122002</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-white block mb-1">Response Time</span>
                We typically respond within 24 hours on business days. For urgent issues, please email us directly.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center gap-4 bg-zinc-900/50 p-8 rounded-2xl border border-green-500/20"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold">Message Sent!</h3>
              <p className="text-muted-foreground text-sm">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
              <Button variant="ghost" onClick={() => setStatus("idle")}>Send Another</Button>
            </motion.div>
          ) : (
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact-first-name" className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                  <input
                    id="contact-first-name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass("firstName")}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-last-name" className="text-sm font-medium">Last Name</label>
                  <input
                    id="contact-last-name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass("lastName")}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass("email")}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass("message")} h-32 resize-none`}
                  placeholder="How can we help?"
                />
                {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Something went wrong. Please try again or email us directly.</span>
                </div>
              )}

              <Button id="contact-submit" className="w-full" size="lg" type="submit" isLoading={status === "loading"}>
                Send Message <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
