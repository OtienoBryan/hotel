"use client";

import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]); // Track selected orders
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for confirmation
  const router = useRouter();
  const queryClient = useQueryClient();

  // Ensure the component is mounted before using useRouter
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to home if user is not authenticated and only if the component is mounted
  useEffect(() => {
    if (status === "authenticated" && isMounted) {
      router.push("/");
    }
  }, [status, isMounted, router]);

  // Fetch orders using react-query
  const { isLoading, error, data } = useQuery<OrderType[]>({
    queryKey: ["orders"],
    queryFn: () => fetch("http://localhost:3000/api/orders", { method: "GET" }).then((res) => res.json()),
  });

  // Mutation to update order status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order Status Updated");
    },
  });

  // Handle order selection
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Handle delete action
  const handleDeleteSelectedOrders = () => {
    if (selectedOrders.length === 0) {
      toast.error("No orders selected");
      return;
    }
    setIsModalOpen(true); // Open the confirmation modal
  };

  // Handle update status form submission
  const handleStatusUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const status = (e.currentTarget.elements[0] as HTMLInputElement).value;
    updateStatusMutation.mutate({ id, status });
  };

  // Handle deletion confirmation
  const handleConfirmDelete = () => {
    if (selectedOrders.length > 0) {
      // Perform deletion logic here
      Promise.all(
        selectedOrders.map((id) =>
          fetch(`http://localhost:3000/api/orders/${id}`, {
            method: "DELETE",
          })
        )
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        setSelectedOrders([]);
        setIsModalOpen(false); // Close the modal after deletion
        toast.success("Selected orders deleted");
      });
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedOrders([]);
  };

  // Handle confirm order action
  const handleConfirmOrder = (order: OrderType) => {
    const orderId = order.id; // Ensure you have the correct order ID
    router.push(`/cart?order=${orderId}`);
  };

  if (isLoading || status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  // Check if data is defined and has orders
  if (!data || data.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      {/* Delete Selected Orders Button */}
      <button
        onClick={ handleDeleteSelectedOrders}
        className="bg-red-500 text-white p-2 rounded-md mb-4"
      >
        Delete Selected Orders
      </button>

      {/* Add Item Button */}
      <button
        onClick={() => router.push('/menu')}
        className="bg-blue-500 text-white p-2 rounded-md mb-4 ml-2"
      >
        Add Item
      </button>

      {/* Confirm Order Button */}
      <button
        onClick={() => handleConfirmOrder(data[0])} // Assuming you want to confirm the first order
        className="bg-green-500 text-white p-2 rounded-md mb-4 ml-2"
      >
        Confirm Order
      </button>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-3">
          <thead>
            <tr className="text-left">
              <th>Select</th>
              <th className="hidden md:block">Order ID</th>
              <th>Date</th>
              <th>Price</th>
              <th className="hidden md:block">Products</th>
              <th>Status</th>
              <th className="hidden md:block">Table Number</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: OrderType) => (
              <tr key={item.id} className={`${item.status !== "served" && "bg-red-200"}`}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(item.id)}
                    onChange={() => toggleOrderSelection(item.id)}
                  />
                </td>
                <td className="hidden md:block py-6 px-1">{item.id}</td>
                <td className="py-6 px-1">{item.createdAt.toString().slice(0, 10)}</td>
                <td className="py-6 px-1">{item.price}</td>
                <td className="hidden md:block py-6 px-1">
                  {item.orderProducts && item.orderProducts.length > 0
                    ? item.orderProducts.map(product => product.product.title).join(", ") || "No product available"
                    : "No products"}
                </td>
                {session?.user.isAdmin ? (
                  <td>
                    <form
                      className="flex items-center justify-center gap-4"
                      onSubmit={(e) => handleStatusUpdate(e, item.id)}
                    >
                      <input
                        placeholder={item.status}
                        className="p-2 ring-1 ring-customGreen rounded-md"
                      />
                      <button type="submit" className="bg-customGreen p-2 rounded-full">
                        <Image src="/edit.png" alt="Edit" width={20} height={20} />
                      </button>
                    </form>
                  </td>
                ) : (
                  <td className="py-6 px-1">{item.status}</td>
                )}
                <td className="py-6 px-1">{item.tableNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Deletion */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete the selected orders?</p>
            <div className="mt-4">
              <button onClick={handleConfirmDelete} className="bg-red-500 text-white p-2 rounded-md mr-2">
                Confirm
              </button>
              <button onClick={handleCancelDelete} className="bg-gray-300 p-2 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;