"use client";
import { useState } from "react";
import InputField from "@/components/InputField";
import NavBar from "@/components/NavBar";  // Make sure to use NavBar if needed
import { useRouter } from 'next/navigation';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [subscribedToPromotions, setSubscribedToPromotions] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {  // Nesting user information
          username: email,  // Email as username
          password,
        },
        email,
        email_verified: false,  // Set default values for other fields
        subscribed_to_promotions: subscribedToPromotions,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        address,
        account_state: 'active'
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token); // Save token for further requests
      alert('Signup successful! Please check your email for verification.');
      router.push('/'); // Redirect to home page after successful signup
    } else {
      setError('Signup failed: ' + JSON.stringify(data));
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-5xl font-bold mb-14">Sign up</p>
        <form onSubmit={handleSignup} className="flex flex-col items-center">
          <InputField
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            optional={true}  // Mark this field as optional
          />
          <InputField
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            optional={true}  // Mark this field as optional
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={subscribedToPromotions}
              onChange={(e) => setSubscribedToPromotions(e.target.checked)}
            />
            <span className="ml-2">Subscribe to promotions</span>
          </label>
          <InputField
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="shadow appearance-none border rounded w-96 py-2 px-2 mt-4 mb-5 bg-blue-500 text-white leading-tight focus:outline-none focus:shadow-outline"
          >
            Sign up
          </button>
        </form>
        <p>
          Already registered?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            Sign in
          </a>
        </p>
      </div>
    </>
  );
}
