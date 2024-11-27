import { MenuType } from "@/types/types";
import Link from "next/link";
import React from "react";
//Subcategory
const getData = async (category: string) => {
  const res = await fetch(`http://localhost:3000/api/subcategories?cat=${category}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data!");
  }

  return res.json();
};

type Props = {
  params: { category: string }
}

const MenuPage = async ({ params }: Props) => {
  const category = await params.category; // Await the params here

  const menu: MenuType = await getData(category);

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center">
      {menu.map((item) => (
        <Link
          href={`/menuProducts/${item.id}`}
          key={item.id}
          className="w-full h-1/3 bg-cover p-8 md:h-1/2"
          style={{ backgroundImage: `url(${item.img})` }}
        >
          <div className={`text-${item.color} w-1/2`}>
            <h1 className="uppercase font-bold text-3xl">{item.title}</h1>
            <p className="text-sm my-8">{item.desc}</p>
            <button
              className={`hidden 2xl:block ${
                item.color === "black" ? "bg-black text-white" : "bg-customGreen text-red-500"
              } py-2 px-4 rounded-md`}
            >
             Sub Category
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPage;
