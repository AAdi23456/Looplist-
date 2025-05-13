export async function followUser(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/follow/${userId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to follow user');
  return res.json();
}

export async function unfollowUser(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/follow/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to unfollow user');
  return res.json();
}

export async function getFriends() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/follow/friends', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch friends');
  return res.json();
}

export async function getFollowers() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/follow/followers', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch followers');
  return res.json();
}

export async function getFollowing() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/follow/following', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch following');
  return res.json();
} 