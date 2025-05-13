'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex mb-12">
        <h1 className="text-4xl font-bold mb-2">LoopList</h1>
        <p className="text-xl">Social Streak Tracker for Micro-Habits</p>
      </div>

      <div className="relative flex place-items-center mb-12">
        <div className="streak-card streak-active w-full md:w-96 p-6">
          <h2 className="text-2xl font-semibold mb-4">Ready to build better habits?</h2>
          <p className="mb-6">
            Track your micro-habits, build streaks, and share your progress with others.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth" className="btn-primary">
              Get Started
            </Link>
            <Link href="/explore" className="btn-secondary">
              Explore Loops
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-12 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-6">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Create Loops</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70 mb-3">
            Set up your recurring micro-habits with just a few clicks.
          </p>
          <Link href="/create" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
            Create a Loop &rarr;
          </Link>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Track Streaks</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70 mb-3">
            Visualize your progress and maintain your momentum.
          </p>
          <Link href="/dashboard" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
            View Dashboard &rarr;
          </Link>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Share & Clone</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70 mb-3">
            Discover trending habits from other users and make them your own.
          </p>
          <Link href="/explore" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
            Explore Trending &rarr;
          </Link>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why LoopList Works</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="text-lg font-medium mb-2">Visual Streaks</h3>
            <p className="text-sm opacity-70">
              Our streak visualization makes progress satisfying and motivates consistency
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <div className="text-3xl mb-2">👋</div>
            <h3 className="text-lg font-medium mb-2">Social Accountability</h3>
            <p className="text-sm opacity-70">
              Sharing your habits publicly increases commitment and follow-through
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🔁</div>
            <h3 className="text-lg font-medium mb-2">Discover & Clone</h3>
            <p className="text-sm opacity-70">
              Find habits that work for others and quickly adapt them to your routine
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
            <p className="text-sm opacity-70">
              Track completion rates and streak history to see your growth over time
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 