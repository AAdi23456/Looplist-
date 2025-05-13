'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import LoopForm from '../../components/LoopForm';
import loopService, { Loop } from '../../services/loopService';

export default function CloneLoop() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loopToClone, setLoopToClone] = useState<Loop | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const loopId = params.id as string;
  
  useEffect(() => {
    async function fetchLoop() {
      try {
        const loop = await loopService.getLoopById(loopId);
        if (loop) {
          setLoopToClone(loop);
        } else {
          setError('Loop not found. Please try a different loop.');
        }
      } catch (err) {
        setError('There was a problem loading the loop. Please try again.');
        console.error('Error fetching loop:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLoop();
  }, [loopId]);
  
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
      setError('There was a problem cloning the loop. Please try again.');
      console.error('Error cloning loop:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Clone Loop</h1>
        <div className="text-center py-12">
          <p>Loading loop details...</p>
        </div>
      </div>
    );
  }
  
  if (error && !loopToClone) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Clone Loop</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Clone Loop</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
            Loop Cloned Successfully!
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            The loop has been added to your dashboard. Redirecting...
          </p>
        </div>
      ) : (
        loopToClone && (
          <LoopForm 
            initialValues={loopToClone}
            onSubmit={handleSubmit}
            isCloning={true}
          />
        )
      )}
    </div>
  );
} 