"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

const UserLinks = () => {
const {status} = useSession()
return (
<div>
     {status === "authenticated"? (
        <div className=" bg-customGreen text-indigo-950 ">
        <Link href="/orders">Orders</Link>
        <span className="ml-4 cursor-pointer" onClick={()=>signOut()}>Logout</span>
        </div>
        ) : (
          <Link href="/login">L</Link>
        )}

    </div>
  )
}

export default UserLinks