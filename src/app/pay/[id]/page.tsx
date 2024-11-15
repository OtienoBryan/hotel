// app/pay/page.tsx
"use client";

import React, { useEffect, useState } from "react"; // Import React
import { useParams } from "next/navigation"; // Import useParams from next/navigation
import CheckoutForm from "@/components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";

// Load Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PayPage = () => {
  const { id } = useParams(); // Get the id parameter from the URL
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      const makeRequest = async () => {
        try {
          const res = await fetch(`http://localhost: 3000/api/create-intent/${id}`,{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}), // Empty request body for a POST request to create an intent
            }
          );
          const data = await res.json();
          setClientSecret(data.clientSecret);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false); // Set loading to false after the request
        }
      };

      makeRequest();
    }
  }, [id]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default PayPage;