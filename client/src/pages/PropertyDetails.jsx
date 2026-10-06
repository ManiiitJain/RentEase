import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ImageGallery } from '../components/ImageGallery';
import { RentalRequestModal } from '../components/RentalRequestModal';
import { Spinner } from '../components/Loader';
import { formatRent, formatDate, getAvailabilityBadge } from '../utils/helpers';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Share2,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Eye,
  Send,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isOwner, isRenter, favorites, toggleFavorite } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertyAPI.getPropertyById(id);
        if (res.data.success) {
          setProperty(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load property details:', error);
        toast.error('Property not found or unavailable.');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!property) return null;

  const isFavorited = favorites.includes(property._id);
  const availability = getAvailabilityBadge(property.status);
  const isMyProperty = user?._id === property.ownerId?._id;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this rental property on RentEase: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/properties"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleFavorite(property._id)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              isFavorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
            />
            <span>{isFavorited ? 'Saved in Wishlist' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share</span>
          </button>

          {isMyProperty && (
            <Link
              to={`/properties/edit/${property._id}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100 transition"
            >
              <span>Edit Listing</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Gallery & Details on Left, Booking & Owner Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column (Gallery + Specs + Amenities + Description) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <ImageGallery images={property.images} title={property.title} />

          {/* Heading Info */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  property.status === 'rented'
                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {availability.text}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                {property.type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {property.furnished}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-primary-600 mr-1.5 flex-shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Bedrooms</span>
              <div className="flex items-center space-x-2 font-bold text-slate-800 text-base">
                <Bed className="w-5 h-5 text-primary-500" />
                <span>{property.bedrooms} Beds</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Bathrooms</span>
              <div className="flex items-center space-x-2 font-bold text-slate-800 text-base">
                <Bath className="w-5 h-5 text-primary-500" />
                <span>{property.bathrooms} Baths</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Super Area</span>
              <div className="flex items-center space-x-2 font-bold text-slate-800 text-base">
                <Maximize2 className="w-5 h-5 text-primary-500" />
                <span>{property.area} sqft</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Furnishing</span>
              <div className="flex items-center space-x-2 font-bold text-slate-800 text-base truncate">
                <Sparkles className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="truncate">{property.furnished}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">About this Property</h3>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Amenities & Features</h3>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Standard residential amenities included.</p>
            )}
          </div>

          {/* Location Map Preview Card */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">Neighborhood Location</h3>
            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-800">{property.location}</p>
              <p className="text-xs text-slate-500 max-w-md">
                Conveniently situated with verified connectivity to arterial highways, supermarkets, schools, and transit routes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Price Card & CTA & Owner Card) */}
        <div className="space-y-6 sticky top-24">
          {/* Booking / Request Action Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Monthly Rental
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {formatRent(property.rent)}
                </span>
                <span className="text-slate-500 text-sm font-medium">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Security deposit equivalent to 2 months rent
              </p>
            </div>

            {/* Availability message */}
            <div className="py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Current Status</span>
              <span
                className={`font-bold ${
                  property.status === 'rented' ? 'text-slate-600' : 'text-emerald-600'
                }`}
              >
                {property.status === 'rented' ? 'Rented Out' : 'Ready to Move In'}
              </span>
            </div>

            {/* Action CTA */}
            {property.status === 'rented' ? (
              <div className="w-full py-3.5 bg-slate-100 text-slate-500 font-semibold rounded-2xl text-center text-sm cursor-not-allowed">
                Property Currently Rented
              </div>
            ) : isMyProperty ? (
              <Link
                to={`/properties/edit/${property._id}`}
                className="block w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl text-center text-sm shadow-md transition"
              >
                Manage Your Listing
              </Link>
            ) : !isAuthenticated ? (
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/login', { state: { from: `/properties/${property._id}` } })}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl text-center text-sm shadow-md shadow-primary-500/25 transition"
                >
                  Sign in to Request Rental
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Quick login enables direct contact with the owner.
                </p>
              </div>
            ) : isOwner ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-700 font-medium">
                You are logged in as an Owner account. Only renters can submit rental requests.
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition active:scale-[0.98]"
              >
                <Send className="w-5 h-5" />
                <span>Send Rental Request</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center text-xs text-slate-500 space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Direct Owner Listing</span>
            </div>
          </div>

          {/* Owner Profile Card */}
          {property.ownerId && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Property Listed By
              </h4>
              <div className="flex items-center space-x-3.5">
                <img
                  src={
                    property.ownerId.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      property.ownerId.name || 'Owner'
                    )}`
                  }
                  alt={property.ownerId.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/20"
                />
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{property.ownerId.name}</h5>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    Verified Host
                  </span>
                </div>
              </div>

              {/* Owner contact details (if logged in or request sent) */}
              <div className="pt-2 space-y-2 border-t border-slate-100 text-xs text-slate-600">
                {property.ownerId.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{property.ownerId.phone}</span>
                  </div>
                )}
                {property.ownerId.email && (
                  <div className="flex items-center space-x-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{property.ownerId.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rental Request Modal */}
      <RentalRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        property={property}
        onSuccess={() => {
          toast.success('Your rental request is now visible in your dashboard.');
        }}
      />
    </div>
  );
};
