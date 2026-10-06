import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Loader';
import {
  PROPERTY_TYPES,
  FURNISHED_TYPES,
  AMENITIES_LIST,
  CITIES,
} from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

export const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Apartment',
    location: '',
    city: 'Ahmedabad',
    rent: '',
    bedrooms: 2,
    bathrooms: 2,
    area: '',
    furnished: 'Semi Furnished',
    status: 'available',
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertyAPI.getPropertyById(id);
        if (res.data.success) {
          const p = res.data.data;
          // Verify ownership
          if (p.ownerId._id !== user._id && p.ownerId !== user._id) {
            toast.error('You do not have permission to edit this property.');
            navigate('/owner/dashboard');
            return;
          }

          setFormData({
            title: p.title,
            description: p.description,
            type: p.type,
            location: p.location,
            city: p.city || 'Ahmedabad',
            rent: p.rent,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            area: p.area,
            furnished: p.furnished,
            status: p.status,
          });
          setSelectedAmenities(p.amenities || []);
          setImageUrls(p.images || []);
        }
      } catch (error) {
        toast.error('Could not load property.');
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, navigate]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImageUrls((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadData.append('images', files[i]);
    }

    setUploading(true);
    try {
      const res = await uploadAPI.uploadImages(uploadData);
      if (res.data.success && res.data.urls) {
        setImageUrls((prev) => [...prev, ...res.data.urls]);
        toast.success(`${res.data.urls.length} image(s) uploaded!`);
      }
    } catch (error) {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      toast.error('Please have at least one property image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        amenities: selectedAmenities,
        images: imageUrls,
      };

      const res = await propertyAPI.updateProperty(id, payload);
      if (res.data.success) {
        toast.success('Property updated successfully!');
        navigate('/owner/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/owner/dashboard')}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Edit Property Listing
          </h1>
          <p className="text-sm text-slate-500">Update availability, price, or specifications.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* Availability Toggle */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Listing Status</h4>
            <p className="text-xs text-slate-500">
              Mark whether this property is currently accepting new rental requests.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'available' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                formData.status === 'available'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'rented' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                formData.status === 'rented'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Rented
            </button>
          </div>
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Property Details
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Property Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Furnishing Condition *
              </label>
              <select
                value={formData.furnished}
                onChange={(e) => setFormData({ ...formData, furnished: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {FURNISHED_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>
        </div>

        {/* Location & Pricing */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Location & Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Address / Locality *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Rent / Month (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Bedrooms *
              </label>
              <input
                type="number"
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Bathrooms *
              </label>
              <input
                type="number"
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Area (sq.ft) *
              </label>
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Amenities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES_LIST.map((amenity) => {
              const checked = selectedAmenities.includes(amenity);
              return (
                <div
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer select-none transition ${
                    checked
                      ? 'bg-primary-50 border-primary-300 text-primary-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border text-xs ${
                      checked
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            4. Images
          </h3>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Add image URL..."
              className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                  <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/owner/dashboard')}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-70"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save & Update Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
