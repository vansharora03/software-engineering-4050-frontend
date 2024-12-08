"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/InputField";
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
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const fieldLabels = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    address: 'Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!firstName) newErrors.firstName = `${fieldLabels.firstName} cannot be empty`;
    if (!lastName) newErrors.lastName = `${fieldLabels.lastName} cannot be empty`;
    if (!email) newErrors.email = `${fieldLabels.email} cannot be empty`;
    if (!password) newErrors.password = `${fieldLabels.password} cannot be empty`;
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username: email,
          password,
        },
        email,
        subscribed_to_promotions: subscribedToPromotions,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        address,
        account_state: 'inactive'
      }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push('register/confirm'); // Redirect to the confirmation page
    } else {
      setErrors({ signup: 'Signup failed: ' + JSON.stringify(data) });
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-start items-center px-4 pt-8">
        <p className="text-4xl font-bold mb-8">Sign up</p>
        <form onSubmit={handleSignup} className="grid grid-cols-2 gap-4 w-full max-w-3xl">
          <div className="col-span-1">
            <InputField
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>

          <div className="col-span-1">
            <InputField
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>

          <div className="col-span-1">
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="col-span-1">
            <InputField
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              optional={true}  // Mark this field as optional
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
          </div>

          <div className="col-span-2">
            <InputField
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              optional={true}  // Mark this field as optional
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

          <div className="col-span-1">
            <InputField
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <div className="col-span-1">
            <InputField
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>

          <div className="col-span-2 flex items-center">
            <input
              type="checkbox"
              checked={subscribedToPromotions}
              onChange={(e) => setSubscribedToPromotions(e.target.checked)}
            />
            <span className="ml-2 text-sm">Subscribe to promotions</span>
          </div>

          {errors.signup && <p className="text-red-500 mb-4 col-span-2 text-xs">{errors.signup}</p>}

          <button
            type="submit"
            className="col-span-2 shadow appearance-none border rounded py-2 px-2 bg-blue-500 text-white text-sm leading-tight focus:outline-none focus:shadow-outline w-full"
          >
            Sign up
          </button>
        </form>
        <p className="text-sm mt-4">
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
