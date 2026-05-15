import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              ST
            </div>
            <div className="text-base font-semibold text-slate-900">Secure Todo</div>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/signin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                Private tasks. Simple workflow.
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                A secure, fast way to manage your todos.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Create tasks, mark them complete, and stay organized with a clean dashboard. Sign in to keep your
                todos tied to your account.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Get started
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                >
                  I already have an account
                </Link>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-6 sm:max-w-xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <dt className="text-xs font-medium text-slate-500">Designed for speed</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">Quick add + toggle</dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <dt className="text-xs font-medium text-slate-500">Built for privacy</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">Account-based access</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Preview</div>
                <div className="text-xs font-medium text-slate-500">Dashboard experience</div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded border border-slate-300 bg-white" />
                    <div className="text-sm font-medium text-slate-700">Write project outline</div>
                  </div>
                  <div className="h-8 w-8 rounded-lg border border-slate-200 bg-white" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded border border-slate-300 bg-white" />
                    <div className="text-sm font-medium text-slate-700">Ship MVP</div>
                  </div>
                  <div className="h-8 w-8 rounded-lg border border-slate-200 bg-white" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-4 w-4 items-center justify-center rounded border border-slate-900 bg-slate-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <div className="text-sm font-medium text-slate-400 line-through">Review PRs</div>
                  </div>
                  <div className="h-8 w-8 rounded-lg border border-slate-200 bg-white" />
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Stats</span>
                  <span className="text-xs font-medium text-slate-500">Progress at a glance</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Total</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">3</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Completed</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Features</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Everything you need for day-to-day task tracking, without the clutter.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Secure authentication</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sign up and sign in to keep your todos tied to your account.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Create, complete, delete</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Add tasks in seconds, toggle completion, and remove items you’re done with.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Dashboard stats</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  See totals and completed counts so you always know what’s left.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Clean, responsive UI</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Looks great on mobile and desktop, with a lightweight, focused layout.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Fast feedback</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Helpful toasts and optimistic updates keep everything feeling snappy.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Protected dashboard</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Unauthenticated users are redirected to sign in before accessing the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Ready to stay organized?</h2>
              <p className="mt-2 text-sm text-slate-600">Create an account or sign in to start tracking todos.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/signin"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Sign up
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-slate-900">Secure Todo</div>
          <div className="text-xs text-slate-500">Built with Next.js + Tailwind</div>
        </div>
      </footer>
    </div>
  );
}
