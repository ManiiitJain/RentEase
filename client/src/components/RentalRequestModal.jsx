import React, { useState } from 'react';
import { Modal } from './Modal';
import { requestAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Calendar, MessageSquare, Send } from 'lucide-react';
import { formatRent } from '../utils/helpers';

export const RentalRequestModal = ({ isOpen, onClose, property, onSuccess }) => {
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Set default move-in date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moveInDate) {
      toast.error('Please select an intended move-in date.');
      return;
    }
    if (!message.trim()) {
      toast.error('Please write a brief message for the property owner.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await requestAPI.createRequest({
        propertyId: property._id,
        moveInDate,
        message: message.trim(),
      });

      if (res.data.success) {
        toast.success('Rental request submitted to the owner!');
        setMessage('');
        setMoveInDate('');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to submit rental request. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Rental Request" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Property Brief */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center space-x-3">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}
            alt={property.title}
            className="w-16 h-14 object-cover rounded-lg flex-shrink-0"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{property.title}</h4>
            <p className="text-xs text-primary-600 font-bold">{formatRent(property.rent)} / month</p>
            <p className="text-[11px] text-slate-500 truncate">{property.location}</p>
          </div>
        </div>

        {/* Move-in Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary-600" />
            Intended Move-In Date
          </label>
          <input
            type="date"
            min={minDate}
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-primary-600" />
            Message to Owner
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself, mention your occupation, family/roommates, and any questions you have for the owner..."
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md shadow-primary-500/25 transition disabled:opacity-70"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Sending Request...' : 'Submit Request'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
