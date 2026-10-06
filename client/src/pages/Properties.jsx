import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { PropertyCardSkeleton } from '../components/Loader';
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ArrowUpDown,
} from 'lucide-react';

export const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL query params
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'all',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    bedrooms: searchParams.get('bedrooms') || 'all',
    furnished: searchParams.get('furnished') || 'all',
    amenities: searchParams.get('amenities') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change externally
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || 'all',
      minRent: searchParams.get('minRent') || '',
      maxRent: searchParams.get('maxRent') || '',
      bedrooms: searchParams.get('bedrooms') || 'all',
      furnished: searchParams.get('furnished') || 'all',
      amenities: searchParams.get('amenities') || '',
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page') || '1', 10),
    }));
  }, [searchParams]);

  // Fetch properties whenever filters change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const params = {
          page: filters.page,
          limit: 9,
          sort: filters.sort,
        };
        if (filters.location) params.location = filters.location;
        if (filters.type && filters.type !== 'all') params.type = filters.type;
        if (filters.minRent) params.minRent = filters.minRent;
        if (filters.maxRent) params.maxRent = filters.maxRent;
        if (filters.bedrooms && filters.bedrooms !== 'all') params.bedrooms = filters.bedrooms;
        if (filters.furnished && filters.furnished !== 'all') params.furnished = filters.furnished;
        if (filters.amenities) params.amenities = filters.amenities;

        const res = await propertyAPI.getProperties(params);
        if (res.data.success) {
          setProperties(res.data.data);
          setTotalCount(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Update URL params
    const newParams = new URLSearchParams();
    if (filters.location) newParams.set('location', filters.location);
    if (filters.type && filters.type !== 'all') newParams.set('type', filters.type);
    if (filters.minRent) newParams.set('minRent', filters.minRent);
    if (filters.maxRent) newParams.set('maxRent', filters.maxRent);
    if (filters.bedrooms && filters.bedrooms !== 'all') newParams.set('bedrooms', filters.bedrooms);
    if (filters.furnished && filters.furnished !== 'all') newParams.set('furnished', filters.furnished);
    if (filters.amenities) newParams.set('amenities', filters.amenities);
    if (filters.sort && filters.sort !== 'newest') newParams.set('sort', filters.sort);
    if (filters.page > 1) newParams.set('page', filters.page.toString());

    setSearchParams(newParams, { replace: true });
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      type: 'all',
      minRent: '',
      maxRent: '',
      bedrooms: 'all',
      furnished: 'all',
      amenities: '',
      sort: 'newest',
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Rental Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {totalCount} verified homes available for rent
          </p>
        </div>

        {/* Search input & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value, page: 1 }))
              }
              placeholder="Search by city or locality..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 shadow-sm"
            />
            {filters.location && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, location: '', page: 1 }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }))
              }
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center space-x-1.5 bg-primary-50 text-primary-600 px-3.5 py-2 rounded-xl text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:col-span-1 sticky top-24">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Property Grid Container */}
        <main className="md:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
                <Inbox className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No properties found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                No properties match your current filters. Try adjusting your search criteria or price range.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-6">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => handlePageChange(pg)}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold transition ${
                        filters.page === pg
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
