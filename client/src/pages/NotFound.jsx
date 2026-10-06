import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto shadow-md">
          <Building className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500">
            The page or listing you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2 flex justify-center space-x-3">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
          >
            <span>Explore Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
