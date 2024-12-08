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
    const [isSubscribed, setIsSubscribed] = useState(null);

    const [paymentCards, setPaymentCards] = useState([
        { id: 1, cardholder_name: '', card_number: '', billing_address: '', expiry_date: '' },
        { id: 2, cardholder_name: '', card_number: '', billing_address: '', expiry_date: '' },
        { id: 3, cardholder_name: '', card_number: '', billing_address: '', expiry_date: '' },
    ]);

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
                setIsSubscribed(data.subscribed_to_promotions);
                const placeholderCards = [ { id: 1, cardholder_name: '', card_number: '', billing_address: '', expiry_date: '' },
                    { id: 2, cardholder_name: '', card_number: '', billing_address: '', expiry_date: '' },
                    { id: 3, cardholder_name: '', card_number: '', billing_address: '', expiry_date: '' },]
                    const response2 = await fetch('http://127.0.0.1:8000/v1/payment-cards', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
    
                if (!response2.ok) throw new Error('Failed to fetch profile data');
                const data2 = await response2.json();
                console.log(data2)
                let i = 0
                for (const pc of data2) {
                    placeholderCards[i] = pc
                    placeholderCards[i].card_number = ''
                    i++;
                }
                setPaymentCards(placeholderCards);
                console.log(paymentCards)
            } catch (error) {
                console.log(error)
                localStorage.removeItem('token');
                router.push('/login');
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
            subscribed_to_promotions: isSubscribed,
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

            await fetch('http://127.0.0.1:8000/v1/payment-cards/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            for (const pc of paymentCards) {
                console.log(JSON.stringify(pc))
                if (pc.cardholder_name !== '') {
                    await fetch('http://127.0.0.1:8000/v1/payment-cards/add', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(pc)
                    });
                }
            }


            if (response.ok) {
                setCurrentPasswordError(null);
                setSuccessMessage('Profile updated successfully!');
                setIsEditing(false);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                const errData = await response.json();
                if (errData.detail === 'Invalid credentials') {
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
        localStorage.setItem('needs_refresh', true);
        router.push('/movies');
    };

    const handleCardChange = (id, field, value) => {
        setPaymentCards((prevCards) =>
            prevCards.map((card) => (card.id === id ? { ...card, [field]: value } : card))
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                    <div className="mb-4">
                        <p className="text-lg font-medium">Subscribed to Promotions:</p>
                        <input
                            type="checkbox"
                            checked={isSubscribed}
                            readOnly
                            className="w-4 h-4"
                        />
                    </div>
                    {paymentCards
                        .filter((card) => card.cardholder_name)
                        .map((card) => (
                            <div key={card.id} className="mb-4">
                                <p className="text-lg font-medium">Payment Card {card.id}:</p>
                                <p className="text-lg">Cardholder: {card.cardholder_name}</p>
                                <p className="text-lg">Billing Address: {card.billing_address}</p>
                                <p className="text-lg">Expiry Date: {card.expiry_date}</p>
                            </div>
                        ))}
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
                <form onSubmit={handleSaveChanges} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
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
                    {paymentCards.map((card) => (
                        <div key={card.id} className="mb-4">
                            <h2 className="text-lg font-medium">Payment Card {card.id}</h2>
                            <input
                                type="text"
                                placeholder="Cardholder Name"
                                value={card.cardholder_name}
                                onChange={(e) => handleCardChange(card.id, 'cardholder_name', e.target.value)}
                                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Card Number"
                                value={card.card_number}
                                onChange={(e) => handleCardChange(card.id, 'card_number', e.target.value)}
                                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Billing Address"
                                value={card.billing_address}
                                onChange={(e) => handleCardChange(card.id, 'billing_address', e.target.value)}
                                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Expiry Date"
                                value={card.expiry_date}
                                onChange={(e) => handleCardChange(card.id, 'expiry_date', e.target.value)}
                                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    ))}
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Subscribed to Promotions:</label>
                        <input
                            type="checkbox"
                            checked={isSubscribed}
                            onChange={(e) => setIsSubscribed(e.target.checked)}
                            className="w-4 h-4"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Enter Password To Save Changes:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                        {currentPasswordError && <p className="text-red-600 text-sm">{currentPasswordError}</p>}
                    </div>
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
