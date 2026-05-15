'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import type { Todo } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';

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
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
      Loading...
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
    todosError,
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
    if (process.env.NODE_ENV !== 'production') {
      // TEMP DEBUG LOGS (requested)
      console.log('[dashboard] user', user);
    }
  }, [user]);

  useEffect(() => {
    if (!isRestoringSession && !user) {
      router.replace('/signin');
    }
  }, [isRestoringSession, router, user]);

  const handleLogout = () => {
    logout();
    router.replace('/signin');
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
      // Sync from backend (don’t rely solely on local state)
      void fetchTodos();
      toast.success('Todo added');
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

      if (nextStatus) {
        toast.success('Task completed');
      }
    } catch (error: unknown) {
      if (previous) {
        updateTodo({
          id: previous.id,
          title: previous.title ?? '',
          isCompleted: Boolean(previous.isCompleted),
        });
      }
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
        'Failed to update todo';
      toast.error(message);
    }
  };

  const deleteTodo = async (id: number) => {
    const previous = todos.find((todo) => todo.id === id);
    removeTodo(id);
    try {
      await api.delete(`/todos/${id}`);
      toast.success('Todo deleted');
    } catch (error: unknown) {
      if (previous) {
        addTodo(previous);
      }
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
        'Failed to delete todo';
      toast.error(message);
    }
  };

  const completedCount = todos.filter((todo) => todo?.isCompleted).length;
  const isAddDisabled = adding || !newTodo.trim();

  if (isRestoringSession) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" suppressHydrationWarning>
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold text-slate-900">Todo App</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600" suppressHydrationWarning>
              {user?.username ?? 'Guest'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold text-slate-900" suppressHydrationWarning>
            Welcome, {user?.username ?? 'there'}!
          </h1>
          <p className="mt-2 text-sm text-slate-500">Stay on top of your tasks today.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">Add a todo</h2>
            <form
              className="mt-4 flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                void handleAddTodo();
              }}
            >
              <input
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
                placeholder="What do you need to do?"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <button
                type="submit"
                disabled={isAddDisabled}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {adding ? 'Adding...' : 'Add'}
              </button>
            </form>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700">Your todos</h3>
              {todosError ? <p className="mt-2 text-sm text-red-600">{todosError}</p> : null}
              {isFetchingTodos ? (
                <div className="mt-3">
                  <Spinner />
                </div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {todos.length === 0 ? (
                    <li className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M12 20h9" />
                          <path d="M12 4h9" />
                          <path d="M4 9h6" />
                          <path d="M4 15h6" />
                          <path d="M6 7v4" />
                          <path d="M6 13v4" />
                        </svg>
                      </div>
                      No todos yet. Create your first task!
                    </li>
                  ) : (
                    todos.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
                      >
                        <label className="flex items-center gap-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={Boolean(todo?.isCompleted)}
                            onChange={() => toggleTodo(todo.id, Boolean(todo?.isCompleted))}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                          />
                          <span className={todo?.isCompleted ? 'text-slate-400 line-through' : ''}>
                            {todo?.title ?? 'Untitled'}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => deleteTodo(todo.id)}
                          className="rounded-md border border-slate-200 p-1 text-slate-600 hover:bg-slate-100"
                          aria-label="Delete todo"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M6 6l1 14h10l1-14" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </section>

          <aside className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">Stats</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Total todos</span>
                <span className="font-semibold text-slate-900">{todos.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Completed</span>
                <span className="font-semibold text-slate-900">{completedCount}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
