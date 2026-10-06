import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRent, getAvailabilityBadge } from '../utils/helpers';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const PropertyCard = ({ property }) => {
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();
  const isFavorited = favorites.includes(property._id);
  const availability = getAvailabilityBadge(property.status);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property._id);
  };

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Container */}
      <Link to={`/properties/${property._id}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm border ${
              property.status === 'rented'
                ? 'bg-slate-900/80 text-slate-200 border-slate-700'
                : 'bg-emerald-600/90 text-white border-emerald-500/30'
            }`}
          >
            {availability.text}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-md shadow-sm border border-white/40">
            {property.type}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-200 ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 hover:scale-110 ring-2 ring-rose-300'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
          }`}
          title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Bottom Image Overlay: Rent & Views */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/50">
            <span className="text-lg font-bold text-white tracking-tight">
              {formatRent(property.rent)}
            </span>
            <span className="text-xs text-slate-300 font-medium ml-1">/mo</span>
          </div>

          {property.views > 0 && (
            <span className="text-xs text-slate-200 flex items-center space-x-1 bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-lg">
              <Eye className="w-3.5 h-3.5" />
              <span>{property.views}</span>
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center text-xs font-medium text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 mr-1 text-primary-500 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property._id}`}>
            <h3 className="font-semibold text-slate-900 text-base line-clamp-1 group-hover:text-primary-600 transition-colors">
              {property.title}
            </h3>
          </Link>

          {/* Furnishing Tag */}
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {property.furnished}
            </span>
          </div>
        </div>

        {/* Specifications Footer */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-1" title={`${property.bedrooms} Bedrooms`}>
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1" title={`${property.bathrooms} Bathrooms`}>
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1" title={`${property.area} Sq.Ft`}>
            <Maximize2 className="w-4 h-4 text-slate-400" />
            <span>{property.area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};
