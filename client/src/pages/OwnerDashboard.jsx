import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI, requestAPI } from '../services/api';
import { ConfirmModal } from '../components/Modal';
import { Spinner, DashboardStatsSkeleton } from '../components/Loader';
import { formatRent, formatDate, getStatusBadge, getAvailabilityBadge } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  Building,
  PlusCircle,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Clock,
  TrendingUp,
  Inbox,
  User,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';

export const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'requests'
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    acceptanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [propsRes, reqsRes] = await Promise.all([
        propertyAPI.getMyProperties(),
        requestAPI.getOwnerRequests(),
      ]);

      if (propsRes.data.success) {
        setProperties(propsRes.data.data);
        if (propsRes.data.stats) {
          setStats(propsRes.data.stats);
        }
      }

      if (reqsRes.data.success) {
        setRequests(reqsRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Could not load owner dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleStatus = async (property) => {
    const newStatus = property.status === 'available' ? 'rented' : 'available';
    try {
      const res = await propertyAPI.updateProperty(property._id, { status: newStatus });
      if (res.data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === property._id ? { ...p, status: newStatus } : p))
        );
        toast.success(`Marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error('Could not toggle status.');
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setDeleting(true);
    try {
      const res = await propertyAPI.deleteProperty(propertyToDelete._id);
      if (res.data.success) {
        toast.success('Listing deleted.');
        setProperties((prev) => prev.filter((p) => p._id !== propertyToDelete._id));
        setDeleteModalOpen(false);
        setPropertyToDelete(null);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to delete property.');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const res = await requestAPI.updateStatus(requestId, newStatus);
      if (res.data.success) {
        toast.success(`Request ${newStatus}!`);
        // Update local requests state
        setRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update request status.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <DashboardStatsSkeleton />
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track views, manage property listings, and respond to rental applications.
          </p>
        </div>

        <Link
          to="/properties/new"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-primary-500/20 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Total Listings
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{stats.totalProperties}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Total Views
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{stats.totalViews}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Pending Requests
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{stats.pendingRequests}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Acceptance Rate
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{stats.acceptanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('properties')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'properties'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>My Listings ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'requests'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>
            Incoming Requests ({requests.length})
            {stats.pendingRequests > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-800 font-bold">
                {stats.pendingRequests} new
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Tab 1: Properties Table / Cards */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          {properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No properties listed yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Start reaching potential tenants today by creating your first rental property listing.
              </p>
              <Link
                to="/properties/new"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your First Property</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="py-3.5 px-5">Property</th>
                      <th className="py-3.5 px-4">Rent</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Views</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {properties.map((p) => {
                      const availability = getAvailabilityBadge(p.status);
                      return (
                        <tr key={p._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-4 px-5">
                            <div className="flex items-center space-x-3.5">
                              <img
                                src={
                                  p.images?.[0] ||
                                  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
                                }
                                alt={p.title}
                                className="w-14 h-12 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                              />
                              <div className="overflow-hidden max-w-xs">
                                <Link
                                  to={`/properties/${p._id}`}
                                  className="font-bold text-slate-900 hover:text-primary-600 truncate block transition"
                                >
                                  {p.title}
                                </Link>
                                <span className="text-xs text-slate-500 truncate block">
                                  {p.location}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {formatRent(p.rent)} <span className="text-xs font-normal text-slate-400">/mo</span>
                          </td>

                          <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                              {p.type}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="flex items-center text-xs text-slate-600 font-medium">
                              <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {p.views || 0}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStatus(p)}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                                p.status === 'rented'
                                  ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}
                              title="Click to toggle availability"
                            >
                              {availability.text}
                            </button>
                          </td>

                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1.5">
                              <Link
                                to={`/properties/${p._id}`}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                title="View public listing"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/properties/edit/${p._id}`}
                                className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 transition"
                                title="Edit listing"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  setPropertyToDelete(p);
                                  setDeleteModalOpen(true);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No rental requests yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                When prospective tenants submit requests with their move-in date and message, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => {
                const statusBadge = getStatusBadge(req.status);
                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 transition hover:border-slate-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      {/* Property connection */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            req.propertyId?.images?.[0] ||
                            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
                          }
                          alt={req.propertyId?.title}
                          className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <Link
                            to={`/properties/${req.propertyId?._id}`}
                            className="text-sm font-bold text-slate-900 hover:text-primary-600 transition"
                          >
                            {req.propertyId?.title || 'Property Listing'}
                          </Link>
                          <span className="text-xs text-primary-600 font-semibold block">
                            {formatRent(req.propertyId?.rent)} / month
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusBadge.dot}`} />
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    {/* Renter Details & Application info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            req.renterId?.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              req.renterId?.name || 'Renter'
                            )}`
                          }
                          alt={req.renterId?.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/20"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{req.renterId?.name}</p>
                          <p className="text-slate-500">{req.renterId?.email}</p>
                          {req.renterId?.phone && (
                            <p className="text-slate-500">{req.renterId?.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">
                            Requested Move-In
                          </span>
                          <span>{formatDate(req.moveInDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">Submitted On</span>
                          <span>{formatDate(req.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center">
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        Tenant Note:
                      </span>
                      <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                        "{req.message}"
                      </p>
                    </div>

                    {/* Actions if pending */}
                    {req.status === 'pending' && (
                      <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                        <button
                          onClick={() => handleUpdateStatus(req._id, 'rejected')}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline Request</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req._id, 'accepted')}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Property Listing"
        message={`Are you sure you want to permanently remove "${propertyToDelete?.title}"? All associated rental requests will also be removed.`}
        confirmText="Yes, Delete Listing"
        confirmVariant="danger"
        isLoading={deleting}
      />
    </div>
  );
};
