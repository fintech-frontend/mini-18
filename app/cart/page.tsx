"use client";

import { useState } from "react";
import CartDiscountBanner from "@/components/CartDiscountBanner";

export default function CartPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="min-h-screen bg-white">
      <CartDiscountBanner
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Keyingi savat qismlari shu yerda */}
    </main>
  );
}