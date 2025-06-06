"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBarpage from "@/components/header";
import axios from "axios";
import ProductsPage from "@/components/shop";
import AboutUs from "@/components/about";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
  
      if (!token) return;

      try {
        await axios.get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
  
    fetchUser();
  }, []);

  const handleBuyNow = () => {
    if (isLoggedIn) {
      router.push("/products");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-black text-white min-h-screen px-10 py-6 relative"
      >
        <NavBarpage />

        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center mt-16 relative">
          {/* Left Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="md:w-1/2 text-center md:text-left relative"
          >
            <h2 className="text-8xl font-extrabold">CARTIER</h2>
            <p className="text-xl text-white mt-4">
              A French luxury-goods conglomerate that designs, manufactures, 
              distributes, and sells jewelry, watches, leather goods, sunglasses, and eyeglasses.
            </p>

            {/* Elegant Timekeeping */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="italic text-4xl mt-4 absolute left-1/2 transform -translate-x-1 translate-y-20 alex-brush"
            >
              Elegant Timekeeping
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#ffffff", color: "#000" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              type="button"
              onClick={handleBuyNow}
              className="bg-gray-300 text-black font-bold px-6 py-3 rounded-full mt-20 hover:bg-gray-400 transition"
            >
              SHOP NOW
            </motion.button>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="md:w-1/2 flex flex-col items-center mt-10 md:mt-0 relative"
          >
            {/* Redefined Craftsmanship */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="italic text-4xl absolute top-[-40px] left-1/2 transform -translate-x-1/2 alex-brush flex flex-col text-center leading-[1.2]"
            >
              <span>Redefined</span>
              <span className="mt-[-2px]">Craftsmanship</span>
            </motion.p>

            {/* Watch Image (Fade-in with Rotation Effect) */}
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="bg-black-400 rounded-2xl mt-20"
            >
              <Image
                src="/images/cartier.png"
                alt="Cartier Watch"
                width={400}
                height={500}
                className="rounded-2xl object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Transition Effect for Page Sections */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <ProductsPage />
        <AboutUs />
      </motion.div>
    </>
  );
}
