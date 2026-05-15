'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import type { Todo } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';
import Link from 'next/link';

type StrapiTodoItem = {
  id: number;
  attributes?: {
    title?: string;
    isCompleted?: boolean;
  };
};

type StrapiTodoEntity = {
  id: number;
  title?: string;
  isCompleted?: boolean;
};

const normalizeTodo = (item: StrapiTodoItem | StrapiTodoEntity): Todo => {
  const attributes = (item as StrapiTodoItem).attributes;
  if (attributes) {
    return {
      id: item.id,
      title: attributes.title ?? 'Untitled',
      isCompleted: Boolean(attributes.isCompleted),
    };
  }

  const entity = item as StrapiTodoEntity;
  return {
    id: entity.id,
    title: entity.title ?? 'Untitled',
    isCompleted: Boolean(entity.isCompleted),
  };
};

function Spinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-100 border-t-zinc-400" />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    todos,
    isRestoringSession,
    isFetchingTodos,
    restoreSession,
    fetchTodos,
    addTodo,
    updateTodo,
    removeTodo,
    logout,
  } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      todos: state.todos,
      isRestoringSession: state.isRestoringSession,
      isFetchingTodos: state.isFetchingTodos,
      todosError: state.todosError,
      restoreSession: state.restoreSession,
      fetchTodos: state.fetchTodos,
      addTodo: state.addTodo,
      updateTodo: state.updateTodo,
      removeTodo: state.removeTodo,
      logout: state.logout,
    }))
  );

  const [newTodo, setNewTodo] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (user) {
      void fetchTodos();
    }
  }, [fetchTodos, user]);

  useEffect(() => {
    if (!isRestoringSession && !user) {
      router.replace('/signin?logout=1');
    }
  }, [isRestoringSession, router, user]);

  const handleLogout = () => {
    logout();
    router.replace('/signin?logout=1');
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      toast.error('Please enter a todo');
      return;
    }
    if (!user) {
      toast.error('You need to sign in');
      return;
    }

    try {
      setAdding(true);
      const response = await api.post('/todos', {
        data: {
          title: newTodo.trim(),
        },
      });
      const created: StrapiTodoItem | StrapiTodoEntity | undefined = response.data?.data ?? response.data;
      if (!created?.id) {
        throw new Error('Invalid todo response');
      }
      const normalized: Todo = normalizeTodo(created);
      addTodo(normalized);
      setNewTodo('');
      void fetchTodos();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
        'Failed to add todo';
      toast.error(message);
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    const previous = todos.find((todo) => todo.id === id);
    const nextStatus = !currentStatus;
    updateTodo({
      id,
      title: previous?.title ?? '',
      isCompleted: nextStatus,
    });
    try {
      const response = await api.put(`/todos/${id}`, {
        data: { isCompleted: nextStatus },
      });
      const updated: StrapiTodoItem | StrapiTodoEntity | undefined = response.data?.data ?? response.data;
      const normalizedUpdated = updated ? normalizeTodo(updated) : null;
      updateTodo({
        id: normalizedUpdated?.id ?? id,
        title: normalizedUpdated?.title ?? previous?.title ?? '',
        isCompleted: normalizedUpdated?.isCompleted ?? nextStatus,
      });
    } catch (error: unknown) {
      if (previous) {
        updateTodo({
          id: previous.id,
          title: previous.title ?? '',
          isCompleted: Boolean(previous.isCompleted),
        });
      }
      toast.error('Failed to update task');
    }
  };

  const deleteTodo = async (id: number) => {
    const previous = todos.find((todo) => todo.id === id);
    removeTodo(id);
    try {
      await api.delete(`/todos/${id}`);
    } catch (error: unknown) {
      if (previous) {
        addTodo(previous);
      }
      toast.error('Failed to delete task');
    }
  };

  const completedCount = todos.filter((todo) => todo?.isCompleted).length;

  if (isRestoringSession || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-100">
      <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-[10px] font-bold text-white">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight">Dashboard</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-xs font-medium text-zinc-500">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-zinc-900 hover:opacity-70 transition-opacity"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Today</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
            <span>{todos.length} tasks</span>
            <span className="h-1 w-1 rounded-full bg-zinc-200" />
            <span>{completedCount} completed</span>
          </div>
        </header>

        <section className="mb-12">
          <form
            className="group relative"
            onSubmit={(event) => {
              event.preventDefault();
              void handleAddTodo();
            }}
          >
            <input
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              placeholder="Add a task..."
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 text-sm transition-all focus:border-zinc-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {adding ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  disabled={!newTodo.trim()}
                  className="rounded-xl bg-zinc-900 p-1.5 text-white opacity-0 transition-opacity group-focus-within:opacity-100 hover:bg-zinc-800 disabled:bg-zinc-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          {isFetchingTodos && todos.length === 0 ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <ul className="space-y-1">
              {todos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-100 py-12 text-center">
                  <p className="text-sm text-zinc-400 font-medium">No tasks yet. Enjoy your day.</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-all hover:bg-zinc-50"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id, Boolean(todo?.isCompleted))}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                        todo?.isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                          : 'border-zinc-300 bg-white hover:border-emerald-400 active:scale-90'
                      }`}
                      aria-label={todo?.isCompleted ? "Mark as incomplete" : "Mark as completed"}
                    >
                      {todo?.isCompleted && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm transition-all ${
                        todo?.isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-800 font-medium'
                      }`}
                    >
                      {todo?.title}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95"
                      aria-label="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
