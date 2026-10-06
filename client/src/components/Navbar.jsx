import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Building,
  PlusCircle,
  LayoutDashboard,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isOwner, isRenter, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition duration-150 ${
      isActive
        ? 'text-primary-600 bg-primary-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Building className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Rent<span className="text-primary-600">Ease</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-semibold text-slate-400 block -mt-1">
                Find. List. Rent.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/properties" className={navLinkClass}>
              Explore Properties
            </NavLink>

            {isAuthenticated && isOwner && (
              <NavLink to="/owner/dashboard" className={navLinkClass}>
                <span className="flex items-center space-x-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Owner Dashboard</span>
                </span>
              </NavLink>
            )}

            {isAuthenticated && isRenter && (
              <NavLink to="/renter/dashboard" className={navLinkClass}>
                <span className="flex items-center space-x-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Renter Dashboard</span>
                </span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Right CTA / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && isOwner && (
              <Link
                to="/properties/new"
                className="inline-flex items-center space-x-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 px-3.5 py-2 rounded-xl text-sm font-semibold transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Property</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        user.name
                      )}`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/20"
                  />
                  <div className="text-left hidden lg:block">
                    <span className="text-sm font-medium text-slate-800 block leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">
                      {user.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>

                        {isOwner ? (
                          <Link
                            to="/owner/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>Owner Dashboard</span>
                          </Link>
                        ) : (
                          <Link
                            to="/renter/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>My Rental Requests</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center space-x-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-sm shadow-primary-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-base font-medium ${
                isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-base font-medium ${
                isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Explore Properties
          </NavLink>

          {isAuthenticated ? (
            <>
              {isOwner && (
                <>
                  <NavLink
                    to="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Owner Dashboard
                  </NavLink>
                  <NavLink
                    to="/properties/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-base font-medium text-primary-600 bg-primary-50"
                  >
                    + List New Property
                  </NavLink>
                </>
              )}

              {isRenter && (
                <NavLink
                  to="/renter/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Renter Dashboard & Saved
                </NavLink>
              )}

              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Profile ({user.name})
              </NavLink>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-base font-medium text-slate-700 bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-base font-medium text-white bg-primary-600"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
