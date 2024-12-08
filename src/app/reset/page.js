"use client"
import { useState } from 'react';
import InputField from '@/components/InputField';
import { useRouter } from 'next/navigation';
export default function ResetPassword() {
    const [step, setStep] = useState(1); // Step 1 for email input, Step 2 for password reset
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [uid, setUid] = useState(null); // store user id
    const router = useRouter();
    

    //handle email verification
    const handleEmailCheck = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/check_email/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Email found! Enter your new password.');
                setMessageType("success")
                // Save the user ID to update the password later
                setUid(data.uid);
                // Move to step 2 
                setStep(2); 
            } else {
                setMessage(data.detail || 'Email not found');
                setMessageType("error")
            }
        } catch (err) {
            setMessage('An error occurred. Please try again.');
            setMessageType('error');
        }
    };

    //handle password reset
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/reset_password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password updated successfully!');
                setMessageType("success")
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setMessage(data.detail || 'An error occurred while updating the password.');
                setMessageType("error")
            }
        } catch (err) {
            setMessage('An error occurred. Please try again.');
            setMessageType("error")
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-8">{step === 1 ? 'Reset Password' : 'Set New Password'}</h2>
            
            {message && (
                <p className={`${messageType === 'success' ? 'text-green-500' : 'text-red-500'} mb-4`}>{message}</p>
            )}
            
            {step === 1 && (
                <form onSubmit={handleEmailCheck}>
                    <InputField
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="shadow appearance-none border rounded py-2 px-4 text-white bg-blue-500">
                        Check Email
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handlePasswordReset}>
                    <InputField
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputField
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className="shadow appearance-none border rounded py-2 px-4 text-white bg-blue-500">
                        Reset Password
                    </button>
                </form>
            )}
        </div>
    );
}