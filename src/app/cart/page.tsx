"use client";
import { useCartStore } from "@/utils/store"; // Ensure clearCart is available
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore(); // Include clearCart
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const createOrder = async (orderData: {
      price: number; // Total price of the order
      status: string; // Set the order status
      userEmail: string | null; // Optional user email
      tableNo: number; // Default table number, can be adjusted as needed
      orderProducts: {
        productId: string; // Ensure this matches the product ID in your database
        quantity: number;
      }[];
    }) => {
    try {
      console.log("Sending order data:", orderData);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const createdOrder = await response.json();
      console.log("Order created:", createdOrder);
       
      // Clear the cart after successful checkout
      clearCart();
      toast.success("Order created successfully! Thank you for your purchase.");
      router.push("/"); // Redirect to order confirmation page
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating order:", error);
        toast.error(`Failed to create order: ${error.message}`);
      } else {
        console.error("An unknown error occurred:", error);
        toast.error("An unexpected error occurred while creating the order.");
      }
    }
  };
  const clearCart = () => {
    products.forEach(item => removeFromCart(item)); // Remove each item from the cart
    toast.success("Cart cleared successfully!"); // Notify the user
  };
  const handleCheckout = async () => {
    console.log("CartPage component rendered");
    console.log("Products in cart:", products);
    console.log("Total items in cart:", totalItems);
    console.log("Total price of items in cart:", totalPrice);

    const orderData = {
      price: totalPrice, // Total price of the order
      status: "pending", // Set the order status
      userEmail: session?.user?.email || null, // Optional user email
      tableNo: 1, // Default table number, can be adjusted as needed
      orderProducts: products.map(item => ({
        productId: item.id, // Ensure this matches the product ID in your database
        quantity: item.quantity, // Quantity of the product
      })),
    };

    // Call the createOrder function
    await createOrder(orderData);

   
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-indigo-950 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2">
        <hr />
        {products.map((item) => (
          <div className="flex items-center justify-between mb-4" key={item.id}>
            {item.img && (
              <Image src={item.img} alt="" width={100} height={100} />
            )}
            <div>
              <h1 className="uppercase text-sm font-bold ">
                {item.title} (x{item.quantity})
              </h1>
              <span>{item.optionTitle}</span>
            </div>
            <h2 className="font-bold">Ksh. {item.price}</h2>
            <span
              className="cursor-pointer"
              onClick={() => removeFromCart(item)}
            >
              <Image src="https://ik.imagekit.io/bja2qwwdjjy/trash%20(1)_C3ZG3vzL2.png?updatedAt=1731237924670" alt="" width={35} height={35} />
            </span>
            <hr />
          </div>
        ))}
        <hr />
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia -50 flex flex-col gap-4 justify-center md:h-1/2 lg:h-full lg:w-1/2 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span>Ksh {totalPrice}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>TOTAL (VAT INCL)</span>
          <span className="font-bold">Ksh {totalPrice}</span>
        </div>
        <Image src="https://ik.imagekit.io/bja2qwwdjjy/Asset%201_yoafp2iSbQ.png?updatedAt=1721116147261" alt="" layout="contain" width={1000} height={20} />
        
        <button
          className="bg-customGreen text-indigo-950 p-3 rounded-md self-end"
          onClick={handleCheckout}
        >
          CHECKOUT
        </button>
        <p className="text-sm text-gray-600">
          *Please note that payment will be processed securely
        </p>
      </div>
    </div>
  );
};

export default CartPage;