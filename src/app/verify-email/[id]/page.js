'use client';
import { useState, useEffect } from "react";

const VerifyEmailPage = ({ params, searchParams }) => {
    const { id: token } = params; // Extract the token from the dynamic route
    const { status } = searchParams; // Extract status from the query parameters
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (status) {
            if (status === "success") {
                setMessage("Thanks! Your email has been verified.");
            } else {
                setMessage("Invalid or expired token.");
            }
        }
    }, [status]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-center border border-gray-700">
                <h1 className="text-3xl font-extrabold text-white mb-6">{message}</h1>
                <p className="text-gray-400">
                    {status === "success"
                        ? "You can now log in and enjoy our services."
                        : "Please try verifying your email again or contact support if the issue persists."}
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
