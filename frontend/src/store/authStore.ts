import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const AUTH_COOKIE_NAME = 'authToken';

type ApiError = {
  response?: {
    status?: number;
    data?: {
      error?: {
        message?: string;
      };
    };
  };
};

const getApiErrorMessage = (error: unknown, fallback: string) =>
  (error as ApiError)?.response?.data?.error?.message || fallback;

const getTokenFromCookie = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return Cookies.get(AUTH_COOKIE_NAME) ?? null;
};

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

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

interface AuthState {
  user: User | null;
  jwt: string | null;
  todos: Todo[];
  isRestoringSession: boolean;
  isFetchingTodos: boolean;
  authError: string | null;
  todosError: string | null;
  setUser: (user: User, jwt: string) => void;
  restoreSession: () => Promise<User | null>;
  fetchTodos: () => Promise<void>;
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (updatedTodo: Todo) => void;
  removeTodo: (id: number) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  jwt: null,
  todos: [],
  isRestoringSession: false,
  isFetchingTodos: false,
  authError: null,
  todosError: null,
  setUser: (user, jwt) => {
    Cookies.set(AUTH_COOKIE_NAME, jwt, {
      expires: 7,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    set({ user, jwt, authError: null });
  },
  restoreSession: async () => {
    const token = getTokenFromCookie();
    if (!token) {
      set({ user: null, jwt: null, authError: null });
      return null;
    }

    const existingUser = get().user;
    if (existingUser) {
      set({ jwt: token });
      return existingUser;
    }

    set({ isRestoringSession: true, authError: null, jwt: token });
    try {
      const response = await api.get('/users/me');
      const restoredUser = response.data as User;

      if (process.env.NODE_ENV !== 'production') {
        // TEMP DEBUG LOGS (requested)
        console.log('[auth] restored user', restoredUser);
      }

      set({ user: restoredUser, jwt: token, authError: null });
      return restoredUser;
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[auth] restore failed', error);
      }
      Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
      const message = 'Session expired. Please sign in again.';
      set({ user: null, jwt: null, todos: [], authError: message });
      toast.error(message);
      return null;
    } finally {
      set({ isRestoringSession: false });
    }
  },
  fetchTodos: async () => {
    const currentUser = get().user;
    if (!currentUser) {
      set({ todos: [], todosError: null });
      return;
    }

    set({ isFetchingTodos: true, todosError: null });
    try {
      const response = await api.get('/todos?populate=*');

      if (process.env.NODE_ENV !== 'production') {
        // TEMP DEBUG LOGS (requested)
        console.log('[todos] raw response', response.data);
      }

      const rawItems: Array<StrapiTodoItem | StrapiTodoEntity> =
        (response.data?.data as Array<StrapiTodoItem | StrapiTodoEntity> | undefined) ??
        (response.data?.results as Array<StrapiTodoItem | StrapiTodoEntity> | undefined) ??
        [];

      const formattedTodos = rawItems.map(normalizeTodo);
      set({ todos: formattedTodos, todosError: null });
    } catch (error: unknown) {
      console.error(error);
      const status = (error as ApiError)?.response?.status;
      const message = getApiErrorMessage(error, 'Failed to load todos');
      set({ todosError: message });
      toast.error('Failed to load todos');

      if (status === 401 || status === 403) {
        get().logout();
      }
    } finally {
      set({ isFetchingTodos: false });
    }
  },
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  logout: () => {
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
    set({ user: null, jwt: null, todos: [], authError: null, todosError: null });
  },
}));

export default useAuthStore;
