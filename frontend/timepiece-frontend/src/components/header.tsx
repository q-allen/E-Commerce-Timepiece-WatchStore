"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Package, ListOrderedIcon, Package2, Package2Icon, PackageOpenIcon, PackageIcon, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export default function NavBarpage() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");

      console.log("🔍 Retrieved Token:", token);

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err: any) {
        console.error("❌ Fetch User Failed:", err.response?.data || err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please log in first!");
      router.push("/login");
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-black text-white px-10 py-6 relative">
      <h1 className="font-bold text-lg">Timepiece</h1>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => router.push("/")} className="hover:underline">
          Home
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => router.push("/products")} className="hover:underline">
          Shop
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => router.push("/about")} className="hover:underline">
          About Us
        </motion.button>
      </div>

      {/* Icons: Cart, Orders, Profile */}
      <div className="flex gap-4 items-center">
        {/* Cart Icon */}
        <motion.button type="button" className="p-2 hover:text-gray-400" whileHover={{ scale: 1.2 }} onClick={() => router.push("/cart")}>
          <ShoppingCart className="w-6 h-6" />
        </motion.button>

        {/* Orders Icon */}
        <motion.button type="button" className="p-2 hover:text-gray-400" whileHover={{ scale: 1.2 }} onClick={() => router.push("/order")}>
          <History className="w-6 h-6" />
        </motion.button>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.button
            type="button"
            className="p-2 hover:text-gray-400 flex items-center"
            whileHover={{ scale: 1.2 }}
            onClick={handleProfileClick}
          >
            <User className="w-6 h-6" />
            {user && <span className="text-sm font-medium ml-2">{user.username}</span>}
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg"
              >
                <button
                  onClick={() => router.push("/home")}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
