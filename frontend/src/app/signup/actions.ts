'use server';

import { redirect } from 'next/navigation';
import { getStrapiApiBaseUrl } from '@/lib/strapiBaseUrl';

export type SignupActionState = {
  error: string | null;
};

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const username = String(formData.get('username') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!username) return { error: 'Username is required' };
  if (!email) return { error: 'Email is required' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters' };

  const baseURL = getStrapiApiBaseUrl();

  const response = await fetch(`${baseURL}/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as
    | { error?: { message?: string } }
    | null;

  if (!response.ok) {
    const message = payload?.error?.message || 'Registration failed';
    return { error: message };
  }

  redirect('/signin');
}
