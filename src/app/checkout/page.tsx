"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState(null);

  const paymentOptions = [
    { id: "mpesa", label: "M-Pesa", image: "/mpesa.png" },
    { id: "card", label: "Card", image: "/card.png" },
    { id: "cash", label: "Cash", image: "/cash.png" },
  ];

  const handlePaymentSelection = (method: React.SetStateAction<null>) => {
    setSelectedPayment(method);
  };

  const handlePayClick = () => {
    if (selectedPayment) {
      toast.success(`Payment successful with ${selectedPayment.label}!`);
      // Redirect to confirmation page or process payment
      router.push("/");
    } else {
      toast.error("Please select a payment method.");
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-indigo-950 mb-6">Checkout</h1>

      {/* Payment Options */}
      <div className="flex gap-4 mb-8">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handlePaymentSelection(option)}
            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center ${
              selectedPayment?.id === option.id
                ? "border-indigo-600 bg-indigo-100"
                : "border-gray-300"
            }`}
          >
            <Image src={option.image} alt={option.label} width={100} height={70} />
            <h3 className="text-xl mt-2">{option.label}</h3>
          </div>
        ))}
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayClick}
        className="bg-indigo-600 text-white py-2 px-8 rounded"
      >
        Proceed to Pay with {selectedPayment?.label || "..." }
      </button>

      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
