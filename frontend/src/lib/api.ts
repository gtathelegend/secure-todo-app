import axios from 'axios';
import Cookies from 'js-cookie';
import { getStrapiApiBaseUrl } from './strapiBaseUrl';

const AUTH_COOKIE_NAME = 'authToken';

const baseURL = getStrapiApiBaseUrl().endsWith('/') 
  ? getStrapiApiBaseUrl() 
  : `${getStrapiApiBaseUrl()}/`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_COOKIE_NAME);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Ensure the URL doesn't start with a slash to avoid double slashes with baseURL
  if (config.url?.startsWith('/')) {
    config.url = config.url.substring(1);
  }
  
  return config;
});

export default api;
