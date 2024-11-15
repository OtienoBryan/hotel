import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { ProductType } from '@/types/types';

const getData =  async (category: string) => {
  const res = await fetch(`http://localhost:3000/api/subcategories?cat=${category}`, {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Failed!");
  }
  return res.json()
}

type Props = {
  params: { category: string }
}

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params; // Await the params here

  const products: ProductType[] = await getData(category);
  return (
    <div className='flex flex-wrap text-indigo-950 '>
      {products.map(item => (
        <Link className='w-full h-[25vh] border-b-2 border-r-2 border-customGreen shadow sm:w-1/2 lg:w-1/3 p-4 flex flex-row justify-between group odd:bg-bggreen'
         href={`/product/${item.id}`} key={item.id}>
          {/* IMAGE CONTAINER */}
          {item.img && (
            <div className="relative h-[80%]">
              <Image src={item.img} alt="" height={250} width={250} className='object-contain rounded-md' />
            </div>
          )}

          {/* TEXT CONTAINER */}
          <div className='flex flex-col ml-5'>
            <h1 className='sm:text-sm uppercase'>{item.title}</h1>
            <p className='text-[12px]'>{item.desc}</p>
            <h2 className='text-sm text-red-300'>KSh.{item.price}</h2>
            <button className='group-hover:block uppercase bg-customGreen text-indigo-950 p-2 rounded-md w-20 text-sm'>Order</button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryPage;