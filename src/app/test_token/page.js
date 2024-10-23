"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Protected = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first!');
      router.push('/login');  // Redirect to login if no token is found
      return;
    }

    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/test_token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,  // Send token in Authorization header
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Token passed for user: ${data}`);
      } else {
        setMessage('Token verification failed');
      }
    };

    fetchData();
  }, [router]);

  return <div>{message}</div>;
};

export default Protected;
