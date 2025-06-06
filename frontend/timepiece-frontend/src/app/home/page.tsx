'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import NavBarpage from "@/components/header";
import { motion } from "framer-motion";

interface UserDetails {
    first_name: string;
    middle_name?: string;
    last_name: string;
    username: string;
    contact: string;
    address: string;
    gender: string;
    email: string;
    image?: string;
}

export default function Home() {
    const [user, setUser] = useState<UserDetails | null>(null);

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
            console.error("Fetch User Failed:", err.response?.data || err);
            setUser(null); 
          }
        };
    
        fetchUser();
      }, []);

      return (
        <>
          <NavBarpage />
          <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 transform transition-all"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120 }}
                  >
                    <Image
                      src={user.image && user.image !== '' ? user.image : "/placeholder-profile.png"}
                      alt="Profile Picture"
                      width={100}
                      height={100}
                      loading="lazy"
                      className="rounded-full border-2 border-gray-300 shadow-md"
                    />
                  </motion.div>
      
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-black text-2xl font-bold mt-4"
                  >
                    {user.first_name} {user.last_name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="text-gray-500"
                  >
                    @{user.username}
                  </motion.p>
                </div>
      
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-4 text-gray-700"
                >
                  <motion.div whileHover={{ scale: 1.02 }} className="p-2 rounded-md transition-all">
                    <h3 className="text-black font-semibold">Email:</h3>
                    <p>{user.email}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="p-2 rounded-md transition-all">
                    <h3 className="text-black font-semibold">Contact:</h3>
                    <p>{user.contact}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="p-2 rounded-md transition-all">
                    <h3 className="text-black font-semibold">Address:</h3>
                    <p>{user.address}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="p-2 rounded-md transition-all">
                    <h3 className="text-black font-semibold">Gender:</h3>
                    <p>{user.gender}</p>
                  </motion.div>
                  {user.middle_name && (
                    <motion.div whileHover={{ scale: 1.02 }} className="p-2 rounded-md transition-all">
                      <h3 className="text-black font-semibold">Middle Name:</h3>
                      <p>{user.middle_name}</p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-gray-600 text-lg"
              >
                Loading user details...
              </motion.p>
            )}
          </div>
        </>
      );
}
