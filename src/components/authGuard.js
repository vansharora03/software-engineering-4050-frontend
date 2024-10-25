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

        return <WrappedComponent {...props} />;
    }

    return AuthGuard;
}
