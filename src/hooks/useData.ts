import { useState, useEffect } from 'react';
import { RESTAURANTS as INITIAL_RESTAURANTS, PROMOS as INITIAL_PROMOS } from '../constants';
import { Restaurant } from '../types';

const RESTAURANTS_KEY = 'bringo_restaurants';
const BANNERS_KEY = 'bringo_banners';

export const useData = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      // Load Restaurants
      const savedRes = localStorage.getItem(RESTAURANTS_KEY);
      if (savedRes) {
        setRestaurants(JSON.parse(savedRes));
      } else {
        localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(INITIAL_RESTAURANTS));
        setRestaurants(INITIAL_RESTAURANTS);
      }

      // Load Banners
      const savedBanners = localStorage.getItem(BANNERS_KEY);
      if (savedBanners) {
        setBanners(JSON.parse(savedBanners));
      } else {
        localStorage.setItem(BANNERS_KEY, JSON.stringify(INITIAL_PROMOS));
        setBanners(INITIAL_PROMOS);
      }
      
      setLoading(false);
    };

    loadData();

    // Sync across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === RESTAURANTS_KEY && e.newValue) {
        setRestaurants(JSON.parse(e.newValue));
      }
      if (e.key === BANNERS_KEY && e.newValue) {
        setBanners(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateRestaurants = async (newRestaurants: Restaurant[]) => {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(newRestaurants));
    setRestaurants(newRestaurants);
  };

  const updateBanners = async (newBanners: any[]) => {
    localStorage.setItem(BANNERS_KEY, JSON.stringify(newBanners));
    setBanners(newBanners);
  };

  return {
    restaurants,
    setRestaurants: updateRestaurants,
    banners,
    setBanners: updateBanners,
    loading
  };
};
