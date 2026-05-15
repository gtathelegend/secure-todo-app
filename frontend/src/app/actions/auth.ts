'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
const AUTH_COOKIE_NAME = 'authToken';
const USER_COOKIE_NAME = 'authUser';

export async function signinAction(formData: FormData) {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;

  try {
    const response = await axios.post(`${API_URL}/auth/local`, {
      identifier,
      password,
    });

    const { jwt, user } = response.data;

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, jwt, {
      httpOnly: false, // Keep it accessible to client for Axios interceptors if needed, or set to true for better security
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    cookieStore.set(USER_COOKIE_NAME, JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Sign in failed',
    };
  }
}

export async function signupAction(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await axios.post(`${API_URL}/auth/local/register`, {
      username,
      email,
      password,
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Registration failed',
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);
}
