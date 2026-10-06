import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI, favoriteAPI } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { Spinner } from '../components/Loader';
import { formatRent, formatDate, getStatusBadge } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  Send,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Building,
  ArrowRight,
  Inbox,
  User,
} from 'lucide-react';

export const RenterDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'favorites'
  const [requests, setRequests] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenterData = async () => {
      try {
        const [reqsRes, favsRes] = await Promise.all([
          requestAPI.getMyRequests(),
          favoriteAPI.getFavorites(),
        ]);

        if (reqsRes.data.success) {
          setRequests(reqsRes.data.data);
        }

        if (favsRes.data.success) {
          setFavorites(favsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to load renter dashboard:', error);
        toast.error('Could not load your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchRenterData();
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Renter Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your rental requests, owner responses, and saved properties.
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto"
        >
          <Building className="w-4 h-4" />
          <span>Browse More Homes</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Requests Sent
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{requests.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Awaiting Approval
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{pendingCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Accepted Leases
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{acceptedCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Saved Wishlist
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{favorites.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'requests'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Rental Requests ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'favorites'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({favorites.length})</span>
        </button>
      </div>

      {/* Tab 1: Rental Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No rental requests submitted yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Explore our listings, find your ideal property, and click "Send Rental Request" to begin.
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition"
              >
                <span>Find Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => {
                const statusBadge = getStatusBadge(req.status);
                const property = req.propertyId;
                const owner = req.ownerId;

                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 transition hover:border-slate-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      {/* Property header */}
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={
                            property?.images?.[0] ||
                            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
                          }
                          alt={property?.title}
                          className="w-16 h-14 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <Link
                            to={`/properties/${property?._id}`}
                            className="font-bold text-slate-900 hover:text-primary-600 text-base transition"
                          >
                            {property?.title || 'Property Listing'}
                          </Link>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-primary-600">
                              {formatRent(property?.rent)} / mo
                            </span>
                            <span>•</span>
                            <span>{property?.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border ${statusBadge.bg}`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 ${statusBadge.dot}`} />
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">Move-In Date</span>
                          <span>{formatDate(req.moveInDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">Submitted</span>
                          <span>{formatDate(req.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">Owner</span>
                          <span>{owner?.name || 'Verified Owner'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Renter's message */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center">
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        Your Note to Owner:
                      </span>
                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                        "{req.message}"
                      </p>
                    </div>

                    {/* If accepted, highlight owner contact details */}
                    {req.status === 'accepted' && (
                      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Congratulations! Your rental request was accepted!</span>
                        </div>
                        <p className="text-xs text-emerald-700">
                          Please connect with the property owner directly to finalize lease documents and key handover:
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-emerald-900 font-semibold">
                          {owner?.phone && (
                            <span className="flex items-center space-x-1.5">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{owner.phone}</span>
                            </span>
                          )}
                          {owner?.email && (
                            <span className="flex items-center space-x-1.5">
                              <Mail className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{owner.email}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Save properties by clicking the heart icon while exploring to quickly compare them later.
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition"
              >
                <span>Browse Rentals</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
