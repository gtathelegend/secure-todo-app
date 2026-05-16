import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import DashboardClient from './DashboardClient';
import type { Todo, User } from '@/store/authStore';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api').replace(/\/+$/, '');

async function getInitialData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  const userCookie = cookieStore.get('authUser')?.value;

  console.log('Server-side token present:', !!token);
  console.log('Server-side user cookie present:', !!userCookie);

  if (!token || !userCookie) {
    return null;
  }

  try {
    const user = JSON.parse(userCookie) as User;
    
    console.log('Fetching initial todos from:', `${API_URL}/todos?populate=*`);
    
    const response = await axios.get(`${API_URL}/todos?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000, // 5 second timeout
    });

    const rawItems = response.data?.data || response.data?.results || [];
    const initialTodos: Todo[] = rawItems.map((item: any) => {
      // Handle Strapi 5 format
      const id = item.id;
      const title = item.title || item.attributes?.title || 'Untitled';
      const isCompleted = Boolean(item.isCompleted !== undefined ? item.isCompleted : item.attributes?.isCompleted);
      
      return { id, title, isCompleted };
    });

    return { initialTodos, user };
  } catch (error: any) {
    console.error('Error fetching initial data:', error.message);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    // Return empty todos instead of null to prevent infinite redirect loops if there's a transient API error
    try {
        const user = JSON.parse(userCookie) as User;
        return { initialTodos: [], user };
    } catch {
        return null;
    }
  }
}

export default async function DashboardPage() {
  const data = await getInitialData();

  if (!data) {
    redirect('/signin');
  }

  return <DashboardClient initialTodos={data.initialTodos} initialUser={data.user} />;
}
