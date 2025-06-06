export interface Category {
    id: number;
    name: string;
    slug: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    stock: number;
    image: string;
    category: Category;
    is_active: boolean;
  }
  
  export const fetchProducts = async (): Promise<Product[]> => {
    const res = await fetch('http://localhost:8000/api/products/');
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
  
    return res.json();
  };
  