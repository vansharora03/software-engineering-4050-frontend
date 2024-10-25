"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMainScreen() {
    const router = useRouter();

    return (
        <div className="admin-main p-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="admin-options grid grid-cols-3 gap-4 mt-4">
                <button
                    onClick={() => router.push('/admin/manage-movies')}
                    className="bg-blue-500 text-white p-4 rounded-lg"
                >
                    Manage Movies
                </button>
                <button
                    onClick={() => router.push('/admin/manage-users')}
                    className="bg-green-500 text-white p-4 rounded-lg"
                >
                    Manage Users
                </button>
                <button
                    onClick={() => router.push('/admin/manage-promotions')}
                    className="bg-yellow-500 text-white p-4 rounded-lg"
                >
                    Manage Promotions
                </button>
            </div>
        </div>
    );
}
