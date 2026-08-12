import { useState } from "react";
// import CartDrawer from "./CartDrawer"; // fayl yo'lini to'g'rilang
import CartDrawer from "./CartDiscountBanner"
export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* Navbardagi korzina tugmasi */}
      <button onClick={() => setIsCartOpen(true)}>
        Корзина
      </button>

      {/* Cart Drawer komponenti */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}