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

// Base URLs — injected at build time via VITE_* (see the Dockerfile build args),
// falling back to the PROD endpoints so a build with no args behaves exactly as before.
const USER_ENDPOINT = import.meta.env.VITE_USER_ENDPOINT || 'https://micro-api-one.terraterri.com';
const MASTERS_ENDPOINT = import.meta.env.VITE_MASTERS_ENDPOINT || 'https://micro-api-three.terraterri.com';
const SERVICES_ENDPOINT = import.meta.env.VITE_SERVICES_ENDPOINT || 'https://micro-api-two.terraterri.com';
const EXPOADMIN_ENDPOINT = (import.meta.env.VITE_EXPOADMIN_ENDPOINT || 'https://expoadminapi.terraterri.com').replace(/\/$/, '');

// Create API clients
const authClient = createClient(`${USER_ENDPOINT}/api`);
const masterClient = createClient(`${MASTERS_ENDPOINT}/api/`);
const projectClient = createClient(`${SERVICES_ENDPOINT}/api/project/`);
const expoClient = createClient(`https://mmworkspace.com/expo/api/`);
const expoAdminClient = createClient(`${EXPOADMIN_ENDPOINT}/`)
const expoApiClient = createClient(`${EXPOADMIN_ENDPOINT}/tt-expo-builder-be/`)

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
    const response = await axios.get('http://localhost/tt-expo-admin-be/expoBannerImage/uploads');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch images');
  }
};

export { authClient, masterClient, projectClient, expoClient, expoAdminClient, expoApiClient };
