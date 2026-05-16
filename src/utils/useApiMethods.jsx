import { useState, useEffect } from 'react';

const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCountries = async () => {
    try {
      const response = await axios.get('/countryMaster/get.php');
      if (response?.data?.status) {
        return response?.data?.data;
      }
    } catch (error) {
      console.error('Error fetching countries:', error?.response?.data?.message || error.message);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

export default useCountries;
