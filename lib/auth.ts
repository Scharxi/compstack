import { cookies } from 'next/headers';

export async function auth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken');
    
    if (!token) {
      return null;
    }

    // In a real application, you would verify the token here
    // For now, we'll just check if it exists
    return {
      user: {
        id: 'user-id',
        username: 'user'
      }
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
} 