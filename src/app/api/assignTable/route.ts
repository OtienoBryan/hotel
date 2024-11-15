import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/connect";

// Define types for input validation
interface OrderProductInput {
  productId: string;
  quantity: number;
}

// Helper function to create JSON responses
const jsonResponse = (data: any, status: number) => 
  new NextResponse(JSON.stringify(data), { status });

// GET method to retrieve orders with related product details
export const GET = async (req: NextRequest) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderProducts: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // Return the retrieved orders with a 200 status code
    return jsonResponse(orders, 200);
  } catch (err) {
    console.error("Error fetching orders:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ message: `Error fetching orders: ${errorMessage}` }, 500);
  }
};

// POST method to create a new order
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Input validation for required fields
    if (!body.price || !body.status || !Array.isArray(body.orderProducts)) {
      return jsonResponse({ message: "Invalid order data. Ensure 'price', 'status', and 'orderProducts' are provided." }, 400);
    }

    const orderProducts: OrderProductInput[] = body.orderProducts;

    // Optional fields for guest or specific table orders
    const userEmail = body.userEmail || null; // Null indicates a guest order
    const tableNo = body.tableNo || 1; // Defaults to 1 if no table number provided

    console.log("Received order data:", body); // For debugging (optional)

    // Create the order with associated order products
    const order = await prisma.order.create({
      data: {
        price: body.price,
        status: body.status,
        userEmail,
        tableNo,
        orderProducts: {
          create: orderProducts.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
    });

    // Return the created order with a 201 status code
    return jsonResponse(order, 201);
  } catch (err) {
    console.error("Error creating order:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ message: `Error creating order: ${errorMessage}` }, 500);
  }
};
