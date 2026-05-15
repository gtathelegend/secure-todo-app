import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import DashboardClient from './DashboardClient';
import type { Todo, User } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

async function getInitialData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  const userCookie = cookieStore.get('authUser')?.value;

  if (!token || !userCookie) {
    return null;
  }

  try {
    const user = JSON.parse(userCookie) as User;
    
    const response = await axios.get(`${API_URL}/todos?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawItems = response.data?.data || response.data?.results || [];
    const initialTodos: Todo[] = rawItems.map((item: any) => ({
      id: item.id,
      title: item.title || item.attributes?.title || 'Untitled',
      isCompleted: Boolean(item.isCompleted || item.attributes?.isCompleted),
    }));

    return { initialTodos, user };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const data = await getInitialData();

  if (!data) {
    redirect('/signin');
  }

  return <DashboardClient initialTodos={data.initialTodos} initialUser={data.user} />;
}
