import React from 'react';
import Menu from './Menu';
import Link from "next/link";
import Image from 'next/image';
import CartIcon from './CartIcon';

const Navbar = () => {
  const user = false
  return (
    <div className='h-10 bg-customGreen text-indigo-950 p-4 flex items-center justify-between border-b-2 border-b-customGreen md:h-24 lg:px-20 xl:px-40 fixed z-50 w-full top-10'>
      {/* LEFT LINKS */}
      <div className='hidden md:flex gap-4 flex-1 '>
        <Link href="/">Homepage</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/">Contact</Link>
      </div>



      {/* {Logo} */}
      <div className='md:absolute top-3 r-2 lg:static flex items-center gap-2 cursor-pointer'>
  <Link href="/">
    <Image src="/log.png" alt="" className="h-8" width="50" height="100" />
  </Link>
</div>
      {/* {Mobile Menu} */}
      <div className='md:hidden'>
        <Menu/>
    </div>
    {/* RIGHT LINKS */}
    <div className='hidden md:flex gap-4 items-center justify-end flex-1' >
        
        <Link href="/orders">My Orders</Link>
        <Link href="/">Contact</Link>
        <CartIcon/>
      </div>

    </div>
  )
}

export default Navbar
