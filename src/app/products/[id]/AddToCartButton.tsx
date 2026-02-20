"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="flex gap-4">
      <Button 
        size="lg" 
        className="flex-1 text-lg h-14" 
        disabled={!product.inStock}
        onClick={handleAdd}
      >
        {isAdding ? "Added!" : "Add to Cart"}
      </Button>
      <Button variant="outline" size="icon" className="h-14 w-14 rounded-lg">
        <ShoppingCart className="w-6 h-6" />
      </Button>
    </div>
  );
}
