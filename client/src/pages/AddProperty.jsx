import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { propertyAPI, uploadAPI } from '../services/api';
import {
  PROPERTY_TYPES,
  FURNISHED_TYPES,
  AMENITIES_LIST,
  CITIES,
} from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  Building,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  IndianRupee,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['Apartment', 'House', 'Villa', 'PG', 'Studio']),
  location: z.string().min(5, 'Please provide full locality / street address'),
  city: z.string().min(2, 'City is required'),
  rent: z.coerce.number().min(500, 'Rent must be at least ₹500'),
  bedrooms: z.coerce.number().min(0, 'Cannot be negative'),
  bathrooms: z.coerce.number().min(1, 'Must have at least 1 bathroom'),
  area: z.coerce.number().min(50, 'Area must be at least 50 sq.ft'),
  furnished: z.enum(['Fully Furnished', 'Semi Furnished', 'Unfurnished']),
});

export const AddProperty = () => {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState(['Parking', 'WiFi']);
  const [imageUrls, setImageUrls] = useState([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'Apartment',
      furnished: 'Semi Furnished',
      city: 'Ahmedabad',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      rent: 25000,
    },
  });

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

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true);
    try {
      const res = await uploadAPI.uploadImages(formData);
      if (res.data.success && res.data.urls) {
        setImageUrls((prev) => [...prev, ...res.data.urls]);
        toast.success(`${res.data.urls.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed. You can also paste public image URLs below.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (imageUrls.length === 0) {
      toast.error('Please add at least one property image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        amenities: selectedAmenities,
        images: imageUrls,
        status: 'available',
      };

      const res = await propertyAPI.createProperty(payload);
      if (res.data.success) {
        toast.success('Property listing created successfully!');
        navigate('/owner/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            List a New Property
          </h1>
          <p className="text-sm text-slate-500">
            Publish your property on RentEase and reach verified tenants in minutes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Property Overview
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Spacious 3 BHK High-Rise Apartment in Bodakdev"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Property Type *
              </label>
              <select
                {...register('type')}
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
                {...register('furnished')}
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
              {...register('description')}
              placeholder="Describe your home, neighborhood advantages, floor level, parking specifics, and house rules..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>
            )}
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
                {...register('location')}
                placeholder="e.g. Near Vastrapur Lake, SG Highway"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
              {errors.location && (
                <p className="text-xs text-rose-600 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                City *
              </label>
              <select
                {...register('city')}
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
                {...register('rent')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 font-semibold"
              />
              {errors.rent && <p className="text-xs text-rose-600 mt-1">{errors.rent.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Bedrooms *
              </label>
              <input
                type="number"
                {...register('bedrooms')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Bathrooms *
              </label>
              <input
                type="number"
                {...register('bathrooms')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Area (sq.ft) *
              </label>
              <input
                type="number"
                {...register('area')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities Checklist */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Amenities & Facilities
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

        {/* Image Upload & Management */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            4. Property Images
          </h3>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-2xl p-6 text-center transition">
            <Upload className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Upload photos from your computer
            </p>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">
              Supports JPG, PNG, WEBP up to 5MB each
            </p>
            <label className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition">
              <span>{uploading ? 'Uploading...' : 'Choose Files'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Or URL input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste an image URL (e.g. Unsplash URL)..."
              className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>

          {/* Image Previews */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                  <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md shadow-primary-500/25 transition disabled:opacity-70"
          >
            {isSubmitting ? 'Creating Listing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
