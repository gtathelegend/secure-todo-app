import axios from 'axios';
import Cookies from 'js-cookie';

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const AUTH_COOKIE_NAME = 'authToken';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL)
  : process.env.NEXT_PUBLIC_STRAPI_URL
    ? `${normalizeBaseUrl(process.env.NEXT_PUBLIC_STRAPI_URL)}/api`
    : undefined;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_COOKIE_NAME);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
