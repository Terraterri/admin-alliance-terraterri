import axios from 'axios';

const attachAuthToken = (config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Factory function to create axios clients
const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  client.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
  return client;
};

// Base URLs from Vite environment variables with production fallbacks
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'https://micro-api-one.terraterri.com/api';
const MASTER_API_URL = import.meta.env.VITE_MASTER_API_URL || 'https://micro-api-three.terraterri.com/api/';
const PROJECT_API_URL = import.meta.env.VITE_PROJECT_API_URL || 'https://micro-api-two.terraterri.com/api/project/';
const EXPO_API_URL = import.meta.env.VITE_EXPO_API_URL || 'https://mmworkspace.com/expo/api/';
const EXPO_ADMIN_API_URL = import.meta.env.VITE_EXPO_ADMIN_API_URL || 'https://expoadminapi.terraterri.com/';
const EXPO_BUILDER_API_URL = import.meta.env.VITE_EXPO_BUILDER_API_URL || 'https://expoadminapi.terraterri.com/tt-expo-builder-be/';

// Create API clients
const authClient = createClient(AUTH_API_URL);
const masterClient = createClient(MASTER_API_URL);
const projectClient = createClient(PROJECT_API_URL);
const expoClient = createClient(EXPO_API_URL);
const expoAdminClient = createClient(EXPO_ADMIN_API_URL);
const expoApiClient = createClient(EXPO_BUILDER_API_URL);

// const authClient = axios.create({
//   baseURL: 'https://micro-api-one.terraterri.com/api',
//   headers: {
//     'Content-Type': 'application/json',
//     // Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
//   }
// });

// const masterClient = axios.create({
//   baseURL: 'https://micro-api-three.terraterri.com/api/',
//   headers: {
//     'Content-Type': 'application/json',
//     // Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });

// const projectClient = axios.create({
//   baseURL: 'https://micro-api-two.terraterri.com/api/project/',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });

// const expoClient = axios.create({
//   baseURL: 'https://mmworkspace.com/expo/api/',
//   headers: {
//     'Content-Type': 'application/json',
//     // Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });


// // Creating an New API Client for Admin Expo
// const expoAdminClient = axios.create({
//   // baseURL: 'https://expo.srinivaskurikuri.in/admin/',
//   baseURL: 'https://expoadminapi.terraterri.com/',

//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });

// const expoApiClient = axios.create({
//   // baseURL: 'https://expo.srinivaskurikuri.in/admin/',
//   baseURL: 'https://expoadminapi.terraterri.com/tt-expo-builder-be/',

//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });


export const fetchImages = async () => {
  try {
    const response = await expoAdminClient.get('expoBannerImage/uploads');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch images');
  }
};

export { 
  authClient, 
  masterClient, 
  projectClient, 
  expoClient, 
  expoAdminClient, 
  expoApiClient,
  AUTH_API_URL,
  MASTER_API_URL,
  PROJECT_API_URL,
  EXPO_API_URL,
  EXPO_ADMIN_API_URL,
  EXPO_BUILDER_API_URL
};
