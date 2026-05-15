import axios from 'axios';
import Cookies from 'js-cookie';
import { getStrapiApiBaseUrl } from './strapiBaseUrl';

const AUTH_COOKIE_NAME = 'authToken';

const baseURL = getStrapiApiBaseUrl();

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
