"use client";

import React, { useState, useEffect } from 'react';
import withAuth from '@/components/authGuard';
import {useRouter} from 'next/navigation';
function ManagePromotions() {
    const [promotions, setPromotions] = useState([]);
    const [newPromotion, setNewPromotion] = useState('');
    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem("token") !== "2df46f907c53c66c1220a0da60e64527da9f3519") {
            router.push("/movies")
        }
    })
    useEffect(() => {
        const fetchPromotions = async () => {
            const response = await fetch('http://127.0.0.1:8000/v1/promotions');
            const result = await response.json();
            setPromotions(result.promotions);
        };
        fetchPromotions();
    }, []);

    const handleAddPromotion = async () => {
        const response = await fetch('http://127.0.0.1:8000/v1/promotions', {
            method: 'POST',
            body: JSON.stringify({ promotion: newPromotion }),
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        setPromotions([...promotions, result.promotion]);
        setNewPromotion('');
    };

    return (
        <div className="manage-promotions p-4">
            <h1 className="text-2xl font-bold">Manage Promotions</h1>
            <div className="promotion-form my-4">
                <input
                    type="text"
                    value={newPromotion}
                    onChange={(e) => setNewPromotion(e.target.value)}
                    placeholder="Enter new promotion"
                    className="p-2 border rounded"
                />
                <button
                    onClick={handleAddPromotion}
                    className="bg-green-500 text-white p-2 ml-2 rounded"
                >
                    Add Promotion
                </button>
            </div>
            <ul className="promotions-list mt-4">
                {promotions.map(promotion => (
                    <li key={promotion.id} className="flex justify-between my-2">
                        <span>{promotion.title}</span>
                        <button className="bg-red-500 text-white p-2 rounded">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default withAuth(ManagePromotions);
