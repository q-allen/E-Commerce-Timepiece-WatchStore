"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBarpage from "@/components/header";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


interface CartItem {
  id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  total_price: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        alert("Please log in first!");
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(res.data);
      } catch (err: any) {
        console.error("Fetch Cart Failed:", err.response?.data || err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [router]);

 
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please log in first!");
      router.push("/login");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/cart/",
        { cart_item_id: cartItemId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCartItems(cartItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity, total_price: res.data.total_price } : item
      ));

    } catch (err: any) {
      console.error("Failed to update quantity:", err.response?.data || err);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please log in first!");
      router.push("/login");
      return;
    }

    try {
      await axios.delete("http://localhost:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { cart_item_id: cartItemId },
      });

      alert("Item removed from cart!");
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    } catch (err: any) {
      console.error("Failed to remove item:", err.response?.data || err);
      alert("Failed to remove item. Please try again.");
    }
  };
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before proceeding to checkout.");
      return;
    }

    router.push("/checkout"); 
  };

  if (loading) return <p className="text-black">Loading cart...</p>;

  return (
    <>
      <NavBarpage />
      <main className="p-6 md:p-12 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">🛒 Your Cart</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border p-4 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  {/* Display Product Image */}
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.product_image}
                      alt={item.product_name || "Product Image"}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.product_name}</h2>

                      {/* Quantity Buttons */}
                      <div className="flex items-center space-x-2 mt-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </motion.button>
                        <span className="text-gray-800">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                          disabled={item.quantity >= 10}
                        >
                          +
                        </motion.button>
                      </div>

                      <p className="font-bold text-gray-800 mt-2">Total: ₱{item.total_price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={22} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
}
