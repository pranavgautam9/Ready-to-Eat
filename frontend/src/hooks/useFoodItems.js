import { useState, useEffect } from 'react';
import config from '../config';

const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_BASE_URL}/api/food-items`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFoodItems(data.food_items || []);
        } else {
          setError('Failed to fetch food items');
        }
      } catch (err) {
        setError('Network error while fetching food items');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  return { foodItems, loading, error, refetch: () => {
    setLoading(true);
    setError(null);
    setFoodItems([]);
  }};
};

export default useFoodItems;
