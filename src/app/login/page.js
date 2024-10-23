"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from "@/components/InputField";

export default function Login() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    // Function to handle login request
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email, // Send email as username for backend
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('token', data.token);
                // Redirect to homepage or dashboard
                router.push('/');
            } else {
                // If response is not okay, show the error
                setError("Incorrect email or password");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <div className="h-screen flex flex-col justify-center items-center">
                <p className="text-5xl font-bold mb-14">Login</p>

                {/* Show error message if login fails */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Email Input Field */}
                <InputField
                    label="Email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                />

                {/* Password Input Field */}
                <InputField
                    type="password"
                    label="Password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                />

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="shadow appearance-none border rounded w-96 py-2 px-2 mt-4 mb-5 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    Login
                </button>

                {/* Forgot Password Link */}
                <a
                    href="/reset"
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                    Forgot Password?
                </a>

                {/* Sign up Link */}
                <div className="mt-4">
                    Don't have an account?{' '}
                    <a
                        href="/register"
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                        Sign up
                    </a>
                </div>
            </div>
        </>
    );
}
