"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Bundles",
    image: "", // URL
    features: "", // Comma separated
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            features: formData.features.split(',').map(f => f.trim()),
            in_stock: true,
            rating: 5.0
        })
      });

      if (res.ok) {
        alert("Product added successfully!");
        router.push('/dashboard/products');
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <input 
              name="name" 
              required
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Ultimate React Bundle"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Price ($)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="199.00"
                  onChange={handleChange}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  name="category" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                  onChange={handleChange}
                >
                    <option value="Bundles">Bundles</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Design">Design</option>
                    <option value="Scripts">Scripts</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <input 
              name="image" 
              required
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="https://images.unsplash.com/..."
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              name="description" 
              required
              rows={4}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="Describe the product..."
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Features (comma separated)</label>
            <textarea 
              name="features" 
              rows={3}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="Responsive, Dark Mode, TypeScript, ..."
              onChange={handleChange}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={loading}>
            Create Product
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
