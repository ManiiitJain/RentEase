# RentEase — Find. List. Rent.

> **RentEase** is a full-stack rental property marketplace connecting property owners and tenants across Gujarat (Ahmedabad, Gandhinagar, Surat, Vadodara) with direct rental requests, real-time status tracking, wishlist management, and zero middleman friction.

---

## 🌟 Key Features

### For Renters
- **Explore & Filter**: Multi-attribute filter by location regex, property type, price range, bedrooms, furnishing status, and amenities.
- **Detailed Property Views**: High-resolution image galleries, carpet area, specifications, neighborhood highlights, and owner cards.
- **Direct Rental Requests**: Submit applications with intended move-in date and a personalized message. Duplicate pending requests are automatically prevented.
- **Live Status Tracking**: Real-time status indicators (**Pending** in amber, **Accepted** in green, **Rejected** in red). Direct owner contact info revealed upon acceptance.
- **Saved Wishlist**: 1-click wishlist toggle with heart icons.
- **Profile Management**: Update contact info, choose custom avatars, and secure passwords.

### For Property Owners
- **Listing Management**: Create, edit, and delete properties with image upload support (Cloudinary cloud storage or local disk fallback).
- **Availability Toggle**: Instant 1-click toggle between **Available** and **Rented**.
- **Application Inbox**: Review tenant applications, read tenant messages, check proposed move-in dates, and **Accept** or **Decline** with one click.
- **Owner Analytics**: Live dashboard metrics including Total Listings, Total Property Views, Pending Requests, and Acceptance Rate.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios, React Hook Form, Zod, react-hot-toast.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs, Multer, Cloudinary v2, Morgan, CORS, dotenv.
- **Testing**: Node.js Native Test Runner (`node --test`), Supertest.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Property Owner** | `owner@rentease.com` | `password123` | Full Owner Dashboard, List Properties, Manage Applications |
| **Tenant / Renter** | `renter@rentease.com` | `password123` | Renter Dashboard, Wishlist, Submit Applications |

*Tip: The Login page includes one-click demo login buttons for instant evaluation.*

---

## 🚀 Quick Start / Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port 27017 or a MongoDB Atlas URI

### 1. Clone & Install Dependencies

From inside the root directory `innovative-assignment/`:

```bash
# Install root, client, and server dependencies
npm run install:all
```

Or install separately:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables

#### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/rentease
JWT_SECRET=rentease_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary credentials (dual-mode: falls back to local uploads if omitted)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend (`client/.env`):
```env
VITE_API_URL=/api
```

### 3. Seed the Database

Populates the database with 13 realistic properties across Ahmedabad, Gandhinagar, Surat, and Vadodara along with demo users, requests, and favorites:

```bash
npm run seed
# or: cd server && npm run seed
```

### 4. Start Development Servers

Run both frontend and backend concurrently:
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Healthcheck: `http://localhost:5000/api/health`

---

## 🧪 Automated Testing

Run the automated backend test suite verifying authentication, role guards, filtering, and the complete rental request workflow:

```bash
cd server && npm test
```

Test Results Summary:
```
✔ GET /api/health should return ok
✔ POST /api/auth/login should authenticate owner and renter
✔ GET /api/properties should return list with pagination & filters
✔ GET /api/properties/:id should return single property and increment view
✔ POST /api/properties should allow owner to create listing
✔ POST /api/properties should forbid renter from creating property
✔ PUT /api/properties/:id should allow owner to update their property
✔ DELETE /api/properties/:id should allow owner to delete their property
✔ POST /api/favorites/:id and GET /api/favorites should manage favorites
✔ GET /api/requests/my and GET /api/requests/owner should return requests
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`renter` or `owner`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive 7-day JWT |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user |

### User Profile (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Private | Get profile details |
| `PUT` | `/api/users/profile` | Private | Update name, phone, avatar, or password |

### Properties (`/api/properties`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/properties` | Public | Query properties (`location`, `type`, `minRent`, `maxRent`, `bedrooms`, `furnished`, `amenities`, `sort`, `page`, `limit`) |
| `GET` | `/api/properties/:id` | Public | Get single property & increment view counter |
| `POST` | `/api/properties` | Private (Owner) | Create a new property listing |
| `PUT` | `/api/properties/:id` | Private (Owner) | Update listing (ownership verified) |
| `DELETE` | `/api/properties/:id` | Private (Owner) | Delete listing & cascade cleanup |
| `GET` | `/api/properties/owner/mine` | Private (Owner) | Retrieve owner's listings & analytics |

### Rental Requests (`/api/requests`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/requests` | Private (Renter) | Submit rental application with move-in date & message |
| `GET` | `/api/requests/my` | Private (Renter) | Get renter's submitted applications & statuses |
| `GET` | `/api/requests/owner` | Private (Owner) | Get incoming requests for owner's properties |
| `PUT` | `/api/requests/:id` | Private (Owner) | Accept or reject application |

### Favorites / Wishlist (`/api/favorites`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | Private | Get user's saved wishlist |
| `POST` | `/api/favorites/:propertyId` | Private | Save property to wishlist |
| `DELETE` | `/api/favorites/:propertyId` | Private | Remove property from wishlist |

### Uploads (`/api/upload`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/upload` | Private | Upload image file(s) via Multer + Cloudinary |

---

## 🚢 Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a user and copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/rentease?retryWrites=true&w=majority`

### 2. Backend (Render / Railway)
1. Deploy from GitHub using the included `server/render.yaml` or create a new Web Service pointing to `server/`.
2. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Secure Random 32+ Character Secret>`
   - `CLIENT_URL`: `<Your Vercel URL>`
3. Build command: `npm install`
4. Start command: `npm start`
5. Seed data: Run `npm run seed` once from Render Shell or Atlas.

### 3. Frontend (Vercel)
1. Connect your repository to [Vercel](https://vercel.com).
2. Set Root Directory to `client/`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable:
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api`
6. `client/vercel.json` ensures client-side routing rewrites work properly without 404s.

---

## 📁 Repository Directory Structure

```
innovative-assignment/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RentalRequestModal.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AddProperty.jsx
│   │   │   ├── EditProperty.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Register.jsx
│   │   │   └── RenterDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── favoriteController.js
│   │   ├── propertyController.js
│   │   ├── requestController.js
│   │   ├── uploadController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── Favorite.js
│   │   ├── Property.js
│   │   ├── RentalRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── userRoutes.js
│   ├── tests/
│   │   └── api.test.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── package.json
│   ├── render.yaml
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 📄 License
ISC © RentEase Technologies
