// api.js or api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL; // Using VITE_API_URL from environment

// Utility function for making fetch requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      throw new Error('Request failed');
    }
    return res.json(); // Return response as JSON
  } catch (err) {
    throw new Error(`API Request Error: ${err}`);
  }
};
