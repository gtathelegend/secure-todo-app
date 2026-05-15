import { create } from 'zustand';
import Cookies from 'js-cookie';

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

interface AuthState {
  user: User | null;
  jwt: string | null;
  todos: Todo[];
  loading: boolean;
  error: string | null;
  setUser: (user: User, jwt: string) => void;
  setUserOnly: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (updatedTodo: Todo) => void;
  removeTodo: (id: number) => void;
  clearAuth: () => void;
}

const tokenFromCookie = typeof window !== 'undefined' ? Cookies.get('authToken') : null;
const userFromStorage =
  typeof window !== 'undefined' ? (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null) : null;

const useAuthStore = create<AuthState>((set) => ({
  user: userFromStorage,
  jwt: tokenFromCookie || null,
  todos: [],
  loading: false,
  error: null,
  setUser: (user, jwt) => {
    Cookies.set('authToken', jwt, { expires: 7 });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, jwt });
  },
  setUserOnly: (user) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
    set({ user });
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
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
  clearAuth: () => {
    Cookies.remove('authToken');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({ user: null, jwt: null, todos: [], error: null });
  },
}));

export default useAuthStore;
