"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavBarpage from "@/components/header";
import { FaUser, FaLock } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion"; // Import framer-motion for animations

// Animations for different sections
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/user/login/", {
        email,
        password,
      });

      // Store access token in localStorage
      localStorage.setItem("access", res.data.access);
      console.log("data:", res.data);
      alert("Successfully logged in!");
      router.push("/");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col bg-gray-100 text-gray-900"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={pageVariants}
    >
      {/* Header */}
      <NavBarpage />

      {/* Main Container */}
      <div className="flex flex-1 items-center justify-center min-h-screen px-4">
        {/* Login Card */}
        <motion.div
          className="bg-white w-full max-w-4xl flex rounded-lg shadow-xl overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          {/* Left Side (Welcome Section) */}
          <motion.div
            className="hidden md:flex flex-col justify-center flex-1 px-12 bg-black text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.7 } }}
          >
            <h1 className="text-4xl font-bold">WELCOME</h1>
            <p className="text-lg mt-2">Luxury & Precision</p>
            <p className="text-sm mt-4">
              Crafting timeless experiences with elegance and expertise.
            </p>
          </motion.div>

          {/* Right Side (Login Form) */}
          <motion.div
            className="flex-1 p-8 md:p-12"
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <h2 className="text-2xl font-bold text-gray-700">Sign in</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your details below</p>

            {error && <p className="text-center text-red-500">{error}</p>}

            <form className="mt-6" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-1">Email</label>
                <motion.div
                  className="flex items-center border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                  whileFocus={{ scale: 1.05 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaUser className="text-gray-500" />
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none bg-transparent ml-2"
                    required
                  />
                </motion.div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-1">Password</label>
                <motion.div
                  className="flex items-center border border-gray-400 rounded-lg px-3 py-2 bg-gray-50"
                  whileFocus={{ scale: 1.05 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaLock className="text-gray-500" />
                  <input
                    type={passwordVisible ? "text" : "password"} // Toggle password visibility
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none bg-transparent ml-2"
                    required
                  />
                  <button
                    type="button"
                    className="text-gray-700 text-sm font-semibold"
                    onClick={() => setPasswordVisible(!passwordVisible)} // Corrected toggle logic
                  >
                    {passwordVisible ? "HIDE" : "SHOW"}
                  </button>
                </motion.div>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-semibold py-3 rounded-lg mt-4 hover:bg-gray-800 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Logging in..." : "Sign in"}
              </motion.button>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600 text-sm mt-4">
                Don't have an account?{" "}
                <Link href="/signup" className="text-black hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
