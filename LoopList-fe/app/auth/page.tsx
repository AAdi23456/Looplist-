'use client';

import { useRouter } from 'next/navigation';
import AuthForms from '../components/AuthForms';

export default function Auth() {
  const router = useRouter();
  
  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForms onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
} 