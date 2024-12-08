"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Function to redirect to /login if user is not signed in and is trying to access a page that needs privileges
export default function withAuth(WrappedComponent) {
    function AuthGuard(props) {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }, [router]);
        useEffect(() => {
            const checkAccountState = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                const response = await fetch('http://127.0.0.1:8000/check_active_account', {
                    method: 'GET',
                    headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    const data = await response.json();
                    if (data.detail !== 'Account is active') {
                    }
                } else {
                    router.push('/register/confirm');
                }
                } catch (error) {
                console.error('Error checking account state:', error);
                }
            }
            };

            checkAccountState();
        }, [router]);
        return <WrappedComponent {...props} />;
    }

    return AuthGuard;
}
