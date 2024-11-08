import React from 'react'
import Link from "next/link";
import Image from 'next/image';
const Footer = () => {
  return (
    <div className='h-12 md:h-24 p-4 lg:p-20 xl:px-40 text-indigo-900 flex items-center justify-between'>
  <Link href="/"> 
  <Image src="https://ik.imagekit.io/bja2qwwdjjy/Artboard%201@1.5x_sHGlLMjLB.png?updatedAt=1730979703401" alt="" className="h-8" width="50" height="100" />
  </Link>
  <p>© 2023 CIT. All Rights Reserved</p>
</div>
  )
}

export default Footer
