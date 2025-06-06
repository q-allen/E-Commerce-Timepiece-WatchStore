"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProducts, Product } from "@/app/api/productsAPI";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBarpage from "@/components/header";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = Array.from(new Set(data.map(product => product.category.name)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory === "" || product.category.name === selectedCategory)
    );
    setFilteredProducts(filtered);
  }, [search, selectedCategory, products]);

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please log in first!");
      router.push("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/cart/",
        { product_id: productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Item added to cart successfully!");
      console.log("🛒 Cart Response:", res.data);
    } catch (error: any) {
      console.error("❌ Failed to add to cart:", error.response?.data || error);
      alert("❌ Failed to add item to cart. Please try again.");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <main className="bg-white text-black min-h-screen">
      {/* Page Title */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold tracking-wide text-gray-900">Explore Our Collection</h1>
        <p className="text-lg text-gray-600 mt-2">Luxury timepieces crafted for perfection.</p>
      </div>
      {/* Product Grid */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white p-6 rounded-xl shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: index * 0.1, // Staggered delay for each product
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              {product.image ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">{product.description}</p>
              <p className="text-black text-sm font-semibold px-3 py-1 ">₱{product.price}</p>

              {/* Animated Button */}
              <motion.button
                onClick={() => handleAddToCart(product.id)}
                className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Add to Cart
              </motion.button>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No products available.
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}
