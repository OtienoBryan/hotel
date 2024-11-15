import { useState, useEffect } from "react";
import { MenuType } from "@/types/types";

// Fetch menu data from the API
const useMenuData = () => {
  const [menu, setMenu] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/categories`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch menu");
        }
        const data : MenuType[]= await res.json();
        setMenu(data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return { menu, loading, error };
};

export default useMenuData;
