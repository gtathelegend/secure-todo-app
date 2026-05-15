'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import { signinAction, type SigninActionState } from './actions';

const initialState: SigninActionState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Signing in...' : 'Sign in'}
    </button>
  );
}

export default function SigninForm() {
  const [state, formAction] = useFormState(signinAction, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-zinc-900">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-xs font-bold text-white mb-6"
          >
            S
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">Log in to your secure dashboard.</p>
        </div>

        <form className="space-y-5" action={formAction}>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-zinc-700" htmlFor="identifier">
              Email or username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-semibold text-zinc-700" htmlFor="password">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {state?.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}

          <SubmitButton />
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-zinc-900 hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
