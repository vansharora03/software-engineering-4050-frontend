"use client";
import React, { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import withAuth from '@/components/authGuard';
function AdminMainScreen() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("token") !== "2df46f907c53c66c1220a0da60e64527da9f3519") {
            router.push("/movies")
        }
    })
    const logOut = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

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
                <button
                    onClick={logOut}
                    className="bg-pink-500 text-white p-4 rounded-lg"
                >
                    Log Out
                </button>

            </div>
        </div>
    );
}
export default withAuth(AdminMainScreen);
