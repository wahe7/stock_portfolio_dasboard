'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);
  console.log(isLoggedIn);
  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold">
        📈 PortfolioApp
      </Link>

      <div className="space-x-4">

        {!isLoggedIn ? (
          <>
            <Link href="/signup" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Signup</Link>
            <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Login</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
