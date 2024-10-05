'use client';
import { useState } from 'react';

export default function ProfilePage() {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [password, setPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing); // Toggle between view and edit modes
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        // Logic to update profile information (e.g., send data to server)
        alert('Profile updated successfully!');
        setIsEditing(false); // Exit edit mode after saving
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            {!isEditing ? (
                // View mode
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <p className="text-lg font-medium">Name:</p>
                        <p className="text-lg">{name}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-medium">Email:</p>
                        <p className="text-lg">{email}</p>
                    </div>
                    <button
                        onClick={handleEditToggle}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                    >
                        Edit Profile
                    </button>
                </div>
            ) : (
                // Edit mode
                <form onSubmit={handleSaveChanges} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter a new password"
                        />
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
