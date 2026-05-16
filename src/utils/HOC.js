import { expoAdminClient } from './httpClient';

export const findObjFromArr = (arr, value, key) => {
  return arr.find((each) => {
    if (each[key] == value) {
      return each;
    }
  });
};
export const getCountries = async () => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
      }
    };
    const response = await expoAdminClient.get('/countryMaster/get.php', config);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};
export const getCities = async (country) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
      }
    };
    let query = '';
    if (country) {
      query = `?country=${country}`;
    }
    const response = await expoAdminClient.get(`/cityMaster/get.php${query}`, config);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};

export const getExpoType = async () => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
      }
    };
    const response = await expoAdminClient.get(`/expoTypes/get.php`, config);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};
