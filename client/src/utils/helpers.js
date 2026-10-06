// Currency formatter in INR
export const formatRent = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Date formatter
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Request Status styling
export const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'Accepted',
        dot: 'bg-emerald-500',
      };
    case 'rejected':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        text: 'Rejected',
        dot: 'bg-rose-500',
      };
    case 'pending':
    default:
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'Pending',
        dot: 'bg-amber-500',
      };
  }
};

// Property Availability styling
export const getAvailabilityBadge = (status) => {
  if (status === 'rented') {
    return {
      bg: 'bg-slate-100 text-slate-600 border-slate-300',
      text: 'Rented Out',
    };
  }
  return {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'Available',
  };
};

export const CITIES = [
  'Ahmedabad',
  'Gandhinagar',
  'Surat',
  'Vadodara',
];

export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'PG',
  'Studio',
];

export const FURNISHED_TYPES = [
  'Fully Furnished',
  'Semi Furnished',
  'Unfurnished',
];

export const AMENITIES_LIST = [
  'Parking',
  'WiFi',
  'AC',
  'Gym',
  'Security',
  'Balcony',
];
