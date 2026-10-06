import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetails } from './pages/PropertyDetails';
import { AddProperty } from './pages/AddProperty';
import { EditProperty } from './pages/EditProperty';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { RenterDashboard } from './pages/RenterDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                fontSize: '13px',
                borderRadius: '12px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#ffffff',
                },
              },
            }}
          />

          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated Profile Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Owner Only Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <RoleRoute allowedRole="owner">
                    <OwnerDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/properties/new"
                element={
                  <RoleRoute allowedRole="owner">
                    <AddProperty />
                  </RoleRoute>
                }
              />
              <Route
                path="/properties/edit/:id"
                element={
                  <RoleRoute allowedRole="owner">
                    <EditProperty />
                  </RoleRoute>
                }
              />

              {/* Renter Only Routes */}
              <Route
                path="/renter/dashboard"
                element={
                  <RoleRoute allowedRole="renter">
                    <RenterDashboard />
                  </RoleRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
