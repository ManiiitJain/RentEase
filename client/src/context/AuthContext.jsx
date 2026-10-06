import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, favoriteAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rentease_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rentease_token') || null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication state
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('rentease_token');
      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('rentease_user', JSON.stringify(res.data.data));
            // Fetch favorites if user is authenticated
            fetchUserFavorites();
          }
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchUserFavorites = async () => {
    try {
      const res = await favoriteAPI.getFavorites();
      if (res.data.success && res.data.favoriteIds) {
        setFavorites(res.data.favoriteIds);
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { data } = res.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('rentease_token', data.token);
      localStorage.setItem('rentease_user', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}!`);
      // Fetch favorites
      fetchUserFavorites();
      return { success: true, user: data };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const { data } = res.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('rentease_token', data.token);
      localStorage.setItem('rentease_user', JSON.stringify(data));
      toast.success(`Account created! Welcome to RentEase, ${data.name}!`);
      return { success: true, user: data };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setFavorites([]);
    localStorage.removeItem('rentease_token');
    localStorage.removeItem('rentease_user');
    toast.success('Logged out successfully.');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('rentease_user', JSON.stringify(next));
      return next;
    });
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) {
      toast.error('Please log in to save properties to your wishlist.');
      return false;
    }

    const isFav = favorites.includes(propertyId);
    try {
      if (isFav) {
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
        await favoriteAPI.removeFavorite(propertyId);
        toast.success('Removed from wishlist');
      } else {
        setFavorites((prev) => [...prev, propertyId]);
        await favoriteAPI.addFavorite(propertyId);
        toast.success('Saved to wishlist!');
      }
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update favorites');
      // Revert on failure
      fetchUserFavorites();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        favorites,
        isAuthenticated: !!user,
        isOwner: user?.role === 'owner',
        isRenter: user?.role === 'renter',
        login,
        register,
        logout,
        updateUser,
        toggleFavorite,
        fetchUserFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
