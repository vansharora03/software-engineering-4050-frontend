"use client";

import React, { useState, useEffect } from "react";
import withAuth from "@/components/authGuard";
import { useRouter } from "next/navigation";

function ManagePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/v1/promotion");
        const result = await response.json();
        setPromotions(result.promotions || []);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };
    fetchPromotions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/v1/add-promotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`, // Add token for authentication
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        setPromotions([...promotions, result.promotion]);
        setFormData({
          name: "",
          discount: "",
        });
      } else {
        console.error("Failed to add promotion");
      }
    } catch (error) {
      console.error("Error adding promotion:", error);
    }
  };

  return (
    <div className="manage-promotions p-4 flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Manage Promotions
        </h1>
        <form onSubmit={handleAddPromotion} className="promotion-form my-4">
          <div className="form-group mb-2 text-black">
            <label className="block text-sm font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter promotion name"
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-black">
              Discount Percentage:
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="Enter discount percentage"
              className="p-2 border rounded w-full"
              step="0.01"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            Add Promotion
          </button>
        </form>

        <ul className="promotions-list mt-4">
          {promotions.length > 0 ? (
            promotions.map((promotion) => (
              <li
                key={promotion.id}
                className="flex justify-between my-2 text-green-500"
              >
                <span>{promotion.name}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No promotions available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(ManagePromotions);
