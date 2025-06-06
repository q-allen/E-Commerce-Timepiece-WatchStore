"use client";
import NavBarpage from "@/components/header";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    contact: "",
    address: "",
    gender: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
  
    console.log("Form Data Sent:", formData); // Debugging log
  
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/signup/",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      
    
      setSuccess("Signup successful! You can now log in.");
      router.push("/login");
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        contact: "",
        address: "",
        gender: "",
        email: "",
        password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      console.error("Axios Error:", error);
      if (error.response) {
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      }
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  
    setLoading(false);
  };
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <NavBarpage />

      {/* Main Container */}
      <div className="flex flex-1 items-center justify-center min-h-screen px-4">
        <div className="bg-white w-full max-w-3xl flex rounded-lg shadow-xl overflow-hidden">
          {/* Left Side (Welcome Section) */}
          <div className="hidden md:flex flex-col justify-center flex-1 px-12 bg-black text-white">
            <h1 className="text-4xl font-bold">WELCOME</h1>
            <p className="text-lg mt-2">Luxury & Precision</p>
            <p className="text-sm mt-4">
              Crafting timeless experiences with elegance and expertise.
            </p>
          </div>

          {/* Right Side (Signup Form) */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-700">Create An Account</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your details below</p>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
              
              {/* Signup Form */}
            <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                  placeholder="First Name"
                  required
                />

                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                  placeholder="Middle Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                  placeholder="Last Name"
                  required
                />
              
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                  placeholder="Username"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                  placeholder="Contact"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                  placeholder="Email"
                  required
                />
              </div>

              <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                  placeholder="Address"
                  required
                />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                placeholder="Password"
                required
              />
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm"
                placeholder="Confirm Password"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-semibold py-2 rounded-lg mt-2 hover:bg-gray-800 transition"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              <p className="text-center text-gray-600 text-xs mt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-black hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
