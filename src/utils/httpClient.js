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

// Create API clients
const authClient = createClient(`https://micro-api-one.terraterri.com/api`);
const masterClient = createClient(`https://micro-api-three.terraterri.com/api/`);
const projectClient = createClient(`https://micro-api-two.terraterri.com/api/project/`);
const expoClient = createClient(`https://mmworkspace.com/expo/api/`);
const expoAdminClient = createClient(`https://expoadminapi.terraterri.com/`)
const expoApiClient = createClient(`https://expoadminapi.terraterri.com/tt-expo-builder-be/`)

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
