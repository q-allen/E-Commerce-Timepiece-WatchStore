"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBarpage from "@/components/header";

const AboutUs = () => {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="relative w-full h-64 md:h-80"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/images/banner.svg"
          alt="About Us Banner"
          layout="fill"
          objectFit="cover"
          className="opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ABOUT TIMEPIECE
          </motion.h1>
          <motion.p
            className="text-center text-white text-lg max-w-2xl mt-2 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Our mission is to craft luxury timepieces that embody elegance, innovation, and precision.
          </motion.p>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="bg-gray-100 py-3 flex justify-center space-x-6 text-gray-700 text-lg font-medium"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {["Who we are", "Our work", "Craftsmanship", "Business services", "Get in touch"].map((tab, index) => (
          <motion.button
            key={index}
            className="hover:text-black transition"
            whileHover={{ scale: 1.1, color: "#000" }}
            transition={{ duration: 0.2 }}
          >
            {tab}
          </motion.button>
        ))}
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="max-w-6xl mx-auto px-6 py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          WHO WE ARE
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: "/images/history.png", title: "Our History", desc: "Discover our legacy of fine watchmaking and timeless craftsmanship." },
            { img: "/images/commitment.png", title: "Our Commitment", desc: "We are dedicated to sustainability, innovation, and quality." },
            { img: "/images/excellence.png", title: "Access to Excellence", desc: "Experience our finest collections and exclusive designs." },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
            >
              <Image src={item.img} alt={item.title} width={500} height={300} className="rounded-md" />
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;