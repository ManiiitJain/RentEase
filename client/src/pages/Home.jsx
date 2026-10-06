import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { propertyAPI } from '../services/api';
import { PropertyCardSkeleton } from '../components/Loader';
import {
  ShieldCheck,
  Zap,
  BadgeCheck,
  Users,
  Building,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await propertyAPI.getProperties({ limit: 6, sort: 'newest' });
        if (res.data.success) {
          setFeaturedProperties(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const topCities = [
    {
      name: 'Ahmedabad',
      count: '4+ Listings',
      desc: 'Bodakdev, Vastrapur & Thaltej',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Gandhinagar',
      count: '3+ Listings',
      desc: 'Infocity & GIFT City Corridor',
      img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Surat',
      count: '3+ Listings',
      desc: 'VIP Road, Vesu & Adajan',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Vadodara',
      count: '3+ Listings',
      desc: 'Alkapuri, Vasna & Fatehgunj',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-primary-900 via-primary-800 to-indigo-950 text-white">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-primary-200 border border-white/15 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Discover Verified Homes in Gujarat</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Find. List. Rent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-white to-primary-300">
              Your Seamless Rental Experience
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Directly connecting property owners and verified tenants. Zero brokerage hassles, transparent leases, and one-click rental requests.
          </p>

          {/* Search Box */}
          <div className="mt-10 max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Stats Bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">1,200+</p>
              <p className="text-xs text-primary-200 mt-0.5">Verified Listings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">4</p>
              <p className="text-xs text-primary-200 mt-0.5">Major Cities</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">98%</p>
              <p className="text-xs text-primary-200 mt-0.5">Approval Satisfaction</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">0%</p>
              <p className="text-xs text-primary-200 mt-0.5">Hidden Commission</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-primary-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>Handpicked Homes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Properties
            </h2>
          </div>
          <Link
            to="/properties"
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Explore By City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Top Locations
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Explore Prime Rental Hubs
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Find the right neighborhood near tech parks, university campuses, and metro routes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCities.map((city) => (
            <div
              key={city.name}
              onClick={() => navigate(`/properties?location=${city.name}`)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={city.img}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-xs text-primary-300 font-semibold uppercase tracking-wider">
                  {city.count}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{city.name}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-primary-400" />
                  {city.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why RentEase / Key Features */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Why RentEase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Engineered for Modern Renters & Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">100% Verified Listings</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every property and host profile undergoes verification. No fake photos or phantom listings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Direct Rental Requests</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly with property owners. Submit move-in requests and get accepted with real-time updates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Zero Middleman Friction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enjoy transparent terms without aggressive agent fees. Owners get full control over their tenant screening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Renters */}
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-primary-500/15">
            <div className="relative z-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-200">
                For Tenants
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Looking for your next home?
              </h3>
              <p className="text-primary-100 text-sm leading-relaxed max-w-sm">
                Filter by furnishings, bedrooms, and amenities across top neighbourhoods with instant move-in requests.
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center space-x-2 bg-white text-primary-700 font-semibold px-5 py-3 rounded-xl shadow-md hover:bg-primary-50 transition"
              >
                <span>Browse Rentals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Owners */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                For Property Owners
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Have a property to rent out?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                List in minutes, showcase multiple HD images, review incoming tenant applications, and fill vacancies faster.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
              >
                <span>List Your Property Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
