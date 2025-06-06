"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBarpage from "@/components/header";
import { motion } from "framer-motion";

interface CartItem {
  id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  total_price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

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

        const total = res.data.reduce((acc: number, item: CartItem) => acc + item.total_price, 0);
        setTotalCost(total);
      } catch (err: any) {
        console.error("Fetch Cart Failed:", err.response?.data || err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [router]);

  const handleConfirmOrder = async () => {
    if (!contact || !address) {
      alert("Please enter your contact number and address!");
      return;
    }

    if (paymentMethod === "Bank Transfer") {
      alert("❌ Bank Transfer is not available right now.");
      setPaymentMethod("COD"); // ✅ Revert back to COD
      return;
    }

    const token = localStorage.getItem("access");

    try {
      await axios.post(
        "http://localhost:8000/api/orders/",
        {
          contact,
          address,
          payment_method: paymentMethod,
          total_price: totalCost,
          cart_items: cartItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Order placed successfully! 🎉");
      router.push("/"); 
    } catch (err: any) {
      console.error("Failed to place order:", err.response?.data || err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) return <p className="text-black">Loading checkout...</p>;

  return (
    <>
      <NavBarpage />
      <main className="p-6 md:p-12 bg-gray-100 min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center text-gray-800"
        >
        Checkout
        </motion.h1>
  
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
  
        {cartItems.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600"
          >
            Your cart is empty.
          </motion.p>
        ) : (
          <>
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border p-4 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
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
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="font-bold text-gray-800">Total: ₱{item.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
  
            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto"
            >
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
  
              {/* Contact Number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-4"
              >
                <label className="block text-gray-800 font-medium">Contact Number:</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-800"
                  required
                />
              </motion.div>
  
              {/* Address */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <label className="block text-gray-800 font-medium">Delivery Address:</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-800"
                  required
                ></textarea>
              </motion.div>
  
              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <label className="block text-gray-800 font-medium">Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => {
                    const selectedMethod = e.target.value;
                    if (selectedMethod === "Bank Transfer") {
                      alert("❌ Bank Transfer is not available right now.");
                      setPaymentMethod("COD"); // ✅ Revert back to COD
                    } else {
                      setPaymentMethod(selectedMethod);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-800"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </motion.div>
  
              {/* Total Cost */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                <p className="text-gray-800 text-lg font-bold">Total Cost: ₱{totalCost.toFixed(2)}</p>
              </motion.div>
            </motion.div>
  
            {/* Confirm Order Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end mt-6 max-w-3xl mx-auto"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmOrder}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                Confirm Order
              </motion.button>
            </motion.div>
          </>
        )}
      </main>
    </>
  );
}
