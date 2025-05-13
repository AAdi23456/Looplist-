'use client';

import { useState, FormEvent } from 'react';
import authService from '../services/authService';

interface AuthFormsProps {
  onAuthSuccess: () => void;
}

export default function AuthForms({ onAuthSuccess }: AuthFormsProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        await authService.login(email, password);
      } else {
        await authService.register(email, password, username);
      }
      
      // Call the success callback
      onAuthSuccess();
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {isLoginMode ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isLoginMode 
            ? 'Sign in to continue tracking your habit streaks' 
            : 'Join LoopList to start building better habits'}
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="Choose a username"
              required={!isLoginMode}
            />
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="Your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : isLoginMode ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={toggleMode}
          className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
        >
          {isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
} 