import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';
import { PROPERTY_TYPES } from '../utils/helpers';

export const SearchBar = ({ initialValues = {}, onSearch }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialValues.location || '');
  const [type, setType] = useState(initialValues.type || 'all');
  const [maxRent, setMaxRent] = useState(initialValues.maxRent || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (location.trim()) queryParams.set('location', location.trim());
    if (type && type !== 'all') queryParams.set('type', type);
    if (maxRent) queryParams.set('maxRent', maxRent);

    if (onSearch) {
      onSearch({ location, type, maxRent });
    } else {
      navigate(`/properties?${queryParams.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-2.5 sm:p-3 border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 md:gap-3"
    >
      {/* Location Input */}
      <div className="flex-1 flex items-center px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20">
        <MapPin className="w-5 h-5 text-primary-500 mr-2.5 flex-shrink-0" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, locality, e.g. Bodakdev, SG Highway"
            className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="hidden md:block w-px h-10 bg-slate-200" />

      {/* Property Type Dropdown */}
      <div className="w-full md:w-48 flex items-center px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20">
        <Home className="w-5 h-5 text-primary-500 mr-2.5 flex-shrink-0" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Property Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden md:block w-px h-10 bg-slate-200" />

      {/* Max Budget Dropdown */}
      <div className="w-full md:w-48 flex items-center px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20">
        <IndianRupee className="w-5 h-5 text-primary-500 mr-2.5 flex-shrink-0" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Max Rent
          </label>
          <select
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="">Any Budget</option>
            <option value="15000">Up to ₹15,000</option>
            <option value="25000">Up to ₹25,000</option>
            <option value="40000">Up to ₹40,000</option>
            <option value="60000">Up to ₹60,000</option>
            <option value="100000">Up to ₹1,00,000</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-primary-500/25 transition duration-150 flex-shrink-0"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </button>
    </form>
  );
};
