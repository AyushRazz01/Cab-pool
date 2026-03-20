// Navigation header component

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/appStore';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          🚗 Carpool
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user.role === 'DRIVER' && (
            <>
              <Link href="/trips" className="text-gray-700 hover:text-primary font-medium">
                My Trips
              </Link>
              <Link href="/create-trip" className="text-gray-700 hover:text-primary font-medium">
                Create Trip
              </Link>
            </>
          )}
          {user.role === 'RIDER' && (
            <>
              <Link href="/search" className="text-gray-700 hover:text-primary font-medium">
                Search Rides
              </Link>
              <Link href="/bookings" className="text-gray-700 hover:text-primary font-medium">
                My Bookings
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user.name[0]}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">{user.name}</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
