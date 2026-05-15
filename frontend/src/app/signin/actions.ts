'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStrapiApiBaseUrl } from '@/lib/strapiBaseUrl';

export type SigninActionState = {
  error: string | null;
};

export async function signinAction(
  _prevState: SigninActionState,
  formData: FormData
): Promise<SigninActionState> {
  const identifier = String(formData.get('identifier') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!identifier || !password) {
    return { error: 'Email/username and password are required' };
  }

  const baseURL = getStrapiApiBaseUrl();

  const response = await fetch(`${baseURL}/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as
    | { jwt?: string; user?: unknown; error?: { message?: string } }
    | null;

  if (!response.ok || !payload?.jwt) {
    const message =
      (payload as { error?: { message?: string } } | null)?.error?.message ||
      'Sign in failed';
    return { error: message };
  }

  cookies().set({
    name: 'authToken',
    value: payload.jwt,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/dashboard');
}
