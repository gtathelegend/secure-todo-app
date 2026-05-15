import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white transition-transform group-hover:scale-105">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight">Secure Todo</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/signin"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-24 pb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 border border-zinc-100">
              Personal & Secure
            </div>
            <h1 className="mt-8 text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl leading-[1.1]">
              Manage tasks with <br />
              <span className="text-zinc-400">absolute clarity.</span>
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-zinc-500">
              A minimalist todo app designed for speed and privacy. No clutter, just your tasks and a focus on getting things done.
            </p>

            <div className="mt-12 flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg"
              >
                Start for free
              </Link>
              <Link
                href="/signin"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-100 bg-zinc-50/50">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-zinc-100 shadow-sm text-zinc-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <h3 className="text-base font-semibold text-zinc-900">Encrypted privacy</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Your tasks are private and tied exclusively to your account.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-zinc-100 shadow-sm text-zinc-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="text-base font-semibold text-zinc-900">Swift workflow</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Add, complete, and organize todos in milliseconds with a focused UI.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-zinc-100 shadow-sm text-zinc-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                </div>
                <h3 className="text-base font-semibold text-zinc-900">Pure minimalism</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  A distraction-free interface that puts your productivity first.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white">Focus on what matters.</h2>
            <p className="mx-auto mt-4 max-w-md text-zinc-400">
              Join others who manage their daily goals with simplicity.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                Create your account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded bg-zinc-900 text-[10px] font-bold text-white">S</div>
            <span className="text-sm font-semibold">Secure Todo</span>
          </div>
          <div className="text-[12px] text-zinc-400">
            © {new Date().getFullYear()} Vedaang Sharma
          </div>
        </div>
      </footer>
    </div>
  );
}
