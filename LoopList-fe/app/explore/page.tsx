'use client';

import { useState, useEffect } from 'react';
import LoopCard from '../components/LoopCard';
import loopService, { Loop } from '../services/loopService';

export default function Explore() {
  const [trendingLoops, setTrendingLoops] = useState<Loop[]>([]);
  const [publicLoops, setPublicLoops] = useState<Loop[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchLoops() {
      try {
        const trending = await loopService.getTrendingLoops();
        const allPublic = await loopService.getPublicLoops();
        
        setTrendingLoops(trending);
        setPublicLoops(allPublic);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching public loops:', error);
        setIsLoading(false);
      }
    }
    
    fetchLoops();
  }, []);
  
  const handleCloneLoop = async (loopId: string) => {
    try {
      const loopToClone = await loopService.getLoopById(loopId);
      if (loopToClone) {
        // In a real app, this would make an API call to clone the loop
        console.log(`Cloned loop: ${loopToClone.title}`);
        // Could show a success message or redirect to the dashboard
      }
    } catch (error) {
      console.error('Error cloning loop:', error);
    }
  };
  
  const handleCheerLoop = async (loopId: string) => {
    try {
      // In a real app, this would make an API call to add a cheer
      console.log(`Cheered loop: ${loopId}`);
    } catch (error) {
      console.error('Error cheering loop:', error);
    }
  };
  
  const filteredLoops = selectedCategory === 'all' 
    ? publicLoops 
    : publicLoops.filter(loop => {
        // This is a simplified way to categorize loops
        // In a real app, loops would have proper category tags
        if (selectedCategory === 'health' && (loop.title.toLowerCase().includes('water') || loop.title.toLowerCase().includes('meditate'))) {
          return true;
        }
        if (selectedCategory === 'focus' && (loop.title.toLowerCase().includes('read') || loop.title.toLowerCase().includes('social media'))) {
          return true;
        }
        if (selectedCategory === 'discipline' && (loop.title.toLowerCase().includes('sugar') || loop.title.toLowerCase().includes('early'))) {
          return true;
        }
        if (selectedCategory === 'fun' && loop.title.toLowerCase().includes('guitar')) {
          return true;
        }
        return false;
      });
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Explore</h1>
        <div className="text-center py-12">
          <p>Loading loops...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      
      {/* Loop of the Day */}
      {trendingLoops.length > 0 && (
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-1 rounded-xl">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <span className="mr-2">⭐</span>
                Loop of the Day
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This loop is trending with the highest streak holders
              </p>
              
              <LoopCard 
                loop={trendingLoops[0]}
                isPublic={true}
                onClone={handleCloneLoop}
                onCheer={handleCheerLoop}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Trending Loops */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Trending Loops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingLoops.slice(1).map(loop => (
            <LoopCard 
              key={loop.id}
              loop={loop}
              isPublic={true}
              onClone={handleCloneLoop}
              onCheer={handleCheerLoop}
            />
          ))}
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Browse Loops</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'all' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setSelectedCategory('health')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'health' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Health
          </button>
          <button 
            onClick={() => setSelectedCategory('focus')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'focus' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Focus
          </button>
          <button 
            onClick={() => setSelectedCategory('discipline')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'discipline' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Discipline
          </button>
          <button 
            onClick={() => setSelectedCategory('fun')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'fun' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Fun
          </button>
        </div>
      </div>
      
      {/* Filtered Loops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLoops.length > 0 ? (
          filteredLoops.map(loop => (
            <LoopCard 
              key={loop.id}
              loop={loop}
              isPublic={true}
              onClone={handleCloneLoop}
              onCheer={handleCheerLoop}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No loops found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 