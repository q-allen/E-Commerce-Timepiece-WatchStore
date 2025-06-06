"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBarpage from "@/components/header";
import { motion } from "framer-motion";

interface OrderItem {
  id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  payment_method: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        alert("Please log in first!");
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
        console.log(res.data);
      } catch (err: any) {
        console.error("Fetch Orders Failed:", err.response?.data || err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) return <p className="text-black">Loading orders...</p>;

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
          📦 Your Orders
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
  
        {orders.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600"
          >
            No orders found.
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white border p-6 rounded-lg shadow-md hover:shadow-lg transform transition-all hover:scale-105"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Order #{order.id}</h2>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                      order.status === "Pending"
                        ? "bg-yellow-300 text-yellow-900"
                        : order.status === "Processing"
                        ? "bg-blue-300 text-blue-900"
                        : order.status === "Shipped"
                        ? "bg-purple-300 text-purple-900"
                        : order.status === "Delivered"
                        ? "bg-green-300 text-green-900"
                        : "bg-red-300 text-red-900"
                    }`}
                  >
                    {order.status}
                  </motion.span>
                </div>
  
                {/* Order Details */}
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Payment Method:</strong> {order.payment_method}
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  <strong>Total Price:</strong> ₱{Number(order.total_price).toFixed(2)}
                </p>
  
                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-4"
                >
                  {order.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                      className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transform transition-all hover:scale-105"
                    >
                      <Image
                        src={item.product_image.startsWith("/")
                          ? `http://localhost:8000${item.product_image}`
                          : item.product_image}
                        alt={item.product_name || "Product Image"}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.product_name}</h3>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="font-bold text-gray-800">₱{Number(item.price).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </>
  );
}
