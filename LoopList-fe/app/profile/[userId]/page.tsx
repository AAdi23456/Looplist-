"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { followUser, unfollowUser, getFollowing } from "../../services/followService";

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const currentUser = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        if (data && !data.error) {
          setProfile(data);
        } else {
          setError("User not found");
        }
      } catch (e) {
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    async function checkFollowing() {
      if (!profile || !profile.id || !currentUser || profile.id === currentUser) return;
      try {
        const following = await getFollowing();
        setIsFollowing(following.some((u: any) => u.id === profile.id));
      } catch (e) {
        setIsFollowing(false);
      }
    }
    checkFollowing();
  }, [profile, currentUser]);

  const handleFollow = async () => {
    if (!profile || !profile.id) return;
    setFollowLoading(true);
    try {
      await followUser(profile.id);
      setIsFollowing(true);
    } catch (e) {}
    setFollowLoading(false);
  };
  const handleUnfollow = async () => {
    if (!profile || !profile.id) return;
    setFollowLoading(true);
    try {
      await unfollowUser(profile.id);
      setIsFollowing(false);
    } catch (e) {}
    setFollowLoading(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="text-center py-12">Loading profile...</div>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error || "User not found"}</div>
        <div className="mt-4">
          <Link href="/dashboard" className="text-primary-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-2xl text-primary-700 font-bold mr-4">
            {profile.displayName?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.displayName || profile.email || profile.id}</h1>
            <div className="text-xs text-gray-500">Joined {new Date(profile.createdAt).toLocaleDateString()}</div>
          </div>
          {profile.id !== currentUser && (
            <button
              className={`ml-auto px-4 py-2 rounded text-xs font-medium border ${isFollowing ? "bg-green-100 text-green-700 border-green-400" : "bg-blue-100 text-blue-700 border-blue-400"}`}
              onClick={isFollowing ? handleUnfollow : handleFollow}
              disabled={followLoading}
            >
              {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
        <div className="mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">User ID:</span> {profile.id}
          </div>
          {profile.displayName && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Display Name:</span> {profile.displayName}
            </div>
          )}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Email:</span> {profile.email}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Link href="/dashboard" className="text-primary-600 hover:underline">&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
} 