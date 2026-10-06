import React from 'react';
import {
  PROPERTY_TYPES,
  FURNISHED_TYPES,
  AMENITIES_LIST,
} from '../utils/helpers';
import { RotateCcw, Filter, Check } from 'lucide-react';

export const FilterSidebar = ({ filters, onChange, onReset }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    let updated;
    if (currentAmenities.includes(amenity)) {
      updated = currentAmenities.filter((a) => a !== amenity);
    } else {
      updated = [...currentAmenities, amenity];
    }
    onChange({ ...filters, amenities: updated.join(',') });
  };

  const selectedAmenities = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-primary-600 flex items-center space-x-1 font-medium transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Property Type */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Property Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleInputChange('type', 'all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              !filters.type || filters.type === 'all'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleInputChange('type', t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filters.type === t
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Rent Price Range */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Monthly Rent (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Min (₹)</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minRent || ''}
              onChange={(e) => handleInputChange('minRent', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Max (₹)</span>
            <input
              type="number"
              placeholder="1,00,000+"
              value={filters.maxRent || ''}
              onChange={(e) => handleInputChange('maxRent', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {['all', '1', '2', '3', '4+'].map((beds) => (
            <button
              key={beds}
              type="button"
              onClick={() => handleInputChange('bedrooms', beds)}
              className={`py-2 rounded-xl text-xs font-medium transition ${
                (beds === 'all' && (!filters.bedrooms || filters.bedrooms === 'all')) ||
                filters.bedrooms === beds
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {beds === 'all' ? 'Any' : beds}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Furnishing
        </label>
        <select
          value={filters.furnished || 'all'}
          onChange={(e) => handleInputChange('furnished', e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 cursor-pointer text-slate-700"
        >
          <option value="all">Any Furnishing</option>
          {FURNISHED_TYPES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities Multi-Select */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Amenities
        </label>
        <div className="space-y-2">
          {AMENITIES_LIST.map((amenity) => {
            const checked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer select-none group"
              >
                <div
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                    checked
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-slate-300 group-hover:border-slate-400 bg-white'
                  }`}
                >
                  {checked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span onClick={() => handleAmenityToggle(amenity)}>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
