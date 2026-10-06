import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Mail, Phone, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Building className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Rent<span className="text-primary-400">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Find. List. Rent. RentEase is Gujarat’s premier verified rental marketplace connecting property owners with trusted tenants seamlessly.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-primary-400" /> Gujarat, India
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1 text-primary-400" /> support@rentease.in
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties" className="hover:text-white transition">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=Apartment" className="hover:text-white transition">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?type=Villa" className="hover:text-white transition">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?type=PG" className="hover:text-white transition">
                  Student & Exec PGs
                </Link>
              </li>
              <li>
                <Link to="/properties?type=Studio" className="hover:text-white transition">
                  Studio Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Major Cities */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Top Cities
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties?location=Ahmedabad" className="hover:text-white transition">
                  Ahmedabad
                </Link>
              </li>
              <li>
                <Link to="/properties?location=Gandhinagar" className="hover:text-white transition">
                  Gandhinagar (GIFT City)
                </Link>
              </li>
              <li>
                <Link to="/properties?location=Surat" className="hover:text-white transition">
                  Surat
                </Link>
              </li>
              <li>
                <Link to="/properties?location=Vadodara" className="hover:text-white transition">
                  Vadodara
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Become a Host / Owner
                </Link>
              </li>
              <li>
                <Link to="/properties/new" className="hover:text-white transition">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Tenant Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Owner Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RentEase Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 mx-1 text-rose-500 fill-rose-500" /> for seamless rental experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};
