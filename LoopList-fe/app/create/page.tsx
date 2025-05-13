'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoopForm from '../components/LoopForm';
import loopService, { Loop } from '../services/loopService';

export default function CreateLoop() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (loopData: Omit<Loop, 'id' | 'currentStreak' | 'longestStreak' | 'completionRate' | 'status' | 'followers' | 'dailyProgress'>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newLoop = await loopService.createLoop(loopData);
      setSuccess(true);
      
      // In a real app, we would redirect to the dashboard with the new loop
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError('There was a problem creating your loop. Please try again.');
      console.error('Error creating loop:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Loop</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
            Loop Created Successfully!
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your new habit loop has been created. Redirecting to dashboard...
          </p>
        </div>
      ) : (
        <LoopForm 
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
} 