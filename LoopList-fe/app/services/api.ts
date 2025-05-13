const BASE_URL = 'http://localhost:8080';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(method: string, path: string, data?: any, customHeaders?: Record<string, string>) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders || {})
  };
  const opts: RequestInit = {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {})
  };
  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (!res.ok) {
    let errorMsg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      errorMsg = err.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path: string, customHeaders?: Record<string, string>) => request('GET', path, undefined, customHeaders),
  post: (path: string, data?: any, customHeaders?: Record<string, string>) => request('POST', path, data, customHeaders),
  put: (path: string, data?: any, customHeaders?: Record<string, string>) => request('PUT', path, data, customHeaders),
  delete: (path: string, customHeaders?: Record<string, string>) => request('DELETE', path, undefined, customHeaders),
}; 