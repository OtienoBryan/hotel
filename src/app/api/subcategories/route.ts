import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server"

// FETCH ALL sub cat
export const GET = async (req:NextRequest) => {
    
    const {searchParams} = new URL(req.url)
    const cat = searchParams.get("cat")


    console.log("CATEGORY IS :"+cat)
try{
const subcategories = await prisma.subCategory.findMany({

    where:{
       ...(cat ? { catid: parseInt(cat) }:""), 
    },
});
return new NextResponse(JSON.stringify(subcategories),
{ status: 200 }
);

    }catch(err){
    console.log(err);
    return new NextResponse(JSON.stringify({message:"something went wrong"}),
    { status: 500 }
   );
 }
};
export const POST = () => {

    return new NextResponse("Hello", {status: 200})

}