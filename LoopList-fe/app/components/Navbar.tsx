'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/authService';
import type { User } from '../services/authService';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on component mount
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 text-xl font-bold">LoopList</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {currentUser ? (
                  <>
                    <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link href="/explore" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Explore
                    </Link>
                    <Link href="/create" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Create Loop
                    </Link>
                  </>
                ) : (
                  <Link href="/explore" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                    Explore
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    {currentUser.profilePicture ? (
                      <img 
                        src={currentUser.profilePicture} 
                        alt={currentUser.username}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-primary-200 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-800 dark:text-primary-200 mr-2">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-sm">{currentUser.username}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/auth" className="btn-primary mr-2">Login</Link>
                  <Link href="/auth" className="btn-secondary">Sign Up</Link>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                <Link href="/explore" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Explore
                </Link>
                <Link href="/create" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Create Loop
                </Link>
              </>
            ) : (
              <Link href="/explore" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Explore
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0 w-full">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {currentUser.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.username}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-primary-200 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-800 dark:text-primary-200 mr-2">
                          {currentUser.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-sm text-white">{currentUser.username}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/auth" className="btn-primary w-full mb-2">Login</Link>
                    <Link href="/auth" className="btn-secondary w-full">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 