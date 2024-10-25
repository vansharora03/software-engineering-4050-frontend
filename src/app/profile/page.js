"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/authGuard';

function ProfilePage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPasswordError, setCurrentPasswordError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://127.0.0.1:8000/profile/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch profile data');

                const data = await response.json();
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setAddress(data.address);
                setEmail(data.email);
            } catch (error) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setSuccessMessage(null);
    };

    const handleSaveChanges = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const updatedData = {
        first_name: firstName,
        last_name: lastName,
        address: address,
        current_password: currentPassword,
        new_password: newPassword,
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/profile/', {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        // Check for 200 OK status for successful updates
        if (response.ok) {
            setCurrentPasswordError(null); // Reset current password error
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setCurrentPassword('');
            setNewPassword('');
        } else {
            const errData = await response.json();

            // Handle specific error cases
            if (errData.detail === "Invalid credentials") {
                setCurrentPasswordError('Current password is incorrect.');
            } else {
                setError(errData.message || 'Failed to update profile');
            }
        }
    } catch (error) {
        setError(error.message || 'Failed to update profile');
    }
};

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentPassword('');
        setNewPassword('');
        setSuccessMessage(null);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
            {!isEditing ? (
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <p className="text-lg font-medium">First Name:</p>
                        <p className="text-lg">{firstName}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-medium">Last Name:</p>
                        <p className="text-lg">{lastName}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-medium">Billing Address:</p>
                        <p className="text-lg">{address}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-medium">Email:</p>
                        <p className="text-lg">{email}</p>
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={handleEditToggle}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSaveChanges} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Billing Address:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Current Password:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                        {currentPasswordError && <p className="text-red-600 text-sm">{currentPasswordError}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default withAuth(ProfilePage);
