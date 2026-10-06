const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Property = require('./models/Property');
const RentalRequest = require('./models/RentalRequest');
const Favorite = require('./models/Favorite');

const sampleProperties = [
  // Ahmedabad (4 properties)
  {
    title: 'Luxury 3 BHK Skyline Apartment in Bodakdev',
    description: 'Breathtaking high-rise apartment in premier Bodakdev neighbourhood. Features Italian marble flooring, panoramic balcony views, modular kitchen with chimney, and 24/7 concierge security.',
    type: 'Apartment',
    location: 'Bodakdev, SG Highway, Ahmedabad',
    city: 'Ahmedabad',
    rent: 42000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    furnished: 'Fully Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Gym', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 142,
  },
  {
    title: 'Modern 2 BHK Oasis near Vastrapur Lake',
    description: 'Chic urban home walking distance from Vastrapur Lake and Alpha One Mall. Well ventilated with spacious bedrooms, split AC units, and high-speed fiber connection ready.',
    type: 'Apartment',
    location: 'Near Vastrapur Lake, Vastrapur, Ahmedabad',
    city: 'Ahmedabad',
    rent: 26000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    furnished: 'Semi Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 89,
  },
  {
    title: 'Grand 4 BHK Independent Villa in Thaltej',
    description: 'Opulent standalone villa with private landscaped garden, home theatre room, covered car porch for 2 vehicles, and solar power backup. Ideal for families seeking privacy and luxury.',
    type: 'Villa',
    location: 'Thaltej Shilaj Road, Thaltej, Ahmedabad',
    city: 'Ahmedabad',
    rent: 75000,
    bedrooms: 4,
    bathrooms: 4,
    area: 3400,
    furnished: 'Fully Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Gym', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 210,
  },
  {
    title: 'Cozy Studio Suite for Tech Professionals',
    description: 'Compact fully furnished studio apartment with dedicated workstation, kitchen pantry, high speed internet, and automated digital door locks near Prahlad Nagar corporate park.',
    type: 'Studio',
    location: 'Prahlad Nagar, SG Highway, Ahmedabad',
    city: 'Ahmedabad',
    rent: 18000,
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    furnished: 'Fully Furnished',
    amenities: ['WiFi', 'AC', 'Security', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ae1b460a58bb?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 115,
  },

  // Gandhinagar (3 properties)
  {
    title: 'Serene 3 BHK Bungalow near Infocity',
    description: 'Peaceful green retreat right near Gandhinagar Infocity and TCS hub. Lush lawns, wide porch, quiet tree-lined avenues, and ample natural lighting.',
    type: 'House',
    location: 'Sector 2, Near Infocity, Gandhinagar',
    city: 'Gandhinagar',
    rent: 32000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    furnished: 'Semi Furnished',
    amenities: ['Parking', 'WiFi', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 64,
  },
  {
    title: 'Premium Student PG with Food & WiFi in Bhaijipura',
    description: 'Fully managed luxury co-living PG near DAIICT and PDPU. Includes thrice-a-day wholesome meals, laundry, gym access, air conditioning, and 24/7 security guard.',
    type: 'PG',
    location: 'Bhaijipura, Kudasan, Gandhinagar',
    city: 'Gandhinagar',
    rent: 11500,
    bedrooms: 1,
    bathrooms: 1,
    area: 350,
    furnished: 'Fully Furnished',
    amenities: ['WiFi', 'AC', 'Gym', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 178,
  },
  {
    title: 'Contemporary 2 BHK in GIFT City Corridor',
    description: 'Smart automated home located adjacent to Gujarat International Finance Tec-City (GIFT City). Central AC, club house access, and direct connectivity to airport corridor.',
    type: 'Apartment',
    location: 'Randesan, GIFT City Road, Gandhinagar',
    city: 'Gandhinagar',
    rent: 28000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1350,
    furnished: 'Fully Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Gym', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 95,
  },

  // Surat (3 properties)
  {
    title: 'Luxurious 4 BHK Riverfront Penthouse in Vesu',
    description: 'Designer duplex penthouse overlooking Tapi river breeze in posh Vesu. Private terrace deck, double-height ceiling in living lounge, and private elevator landing.',
    type: 'Apartment',
    location: 'VIP Road, Vesu, Surat',
    city: 'Surat',
    rent: 55000,
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    furnished: 'Fully Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Gym', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 184,
  },
  {
    title: 'Elegant 3 BHK Row House in Adajan',
    description: 'Charming duplex row house in tranquil gated community with tree-lined pedestrian tracks, private open terrace, and proximity to Gujarat International School.',
    type: 'House',
    location: 'Near LP Savani School, Adajan, Surat',
    city: 'Surat',
    rent: 34000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1950,
    furnished: 'Semi Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 73,
  },
  {
    title: 'Budget-Friendly 1 BHK Flat in Pal',
    description: 'Clean and freshly painted 1 BHK apartment close to metro route and shopping complexes. Excellent water supply, dedicated scooter parking, and low maintenance.',
    type: 'Apartment',
    location: 'Gaurav Path, Pal, Surat',
    city: 'Surat',
    rent: 14000,
    bedrooms: 1,
    bathrooms: 1,
    area: 720,
    furnished: 'Unfurnished',
    amenities: ['Parking', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ae1b460a58bb?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 52,
  },

  // Vadodara (3 properties)
  {
    title: 'Palatial 4 BHK Colonial Villa in Alkapuri',
    description: 'Heritage architectural estate in vintage Alkapuri. Soaring ceilings, teakwood finishes, landscaped garden courtyard, separate servant quarters, and generator backup.',
    type: 'Villa',
    location: 'RC Dutt Road, Alkapuri, Vadodara',
    city: 'Vadodara',
    rent: 68000,
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    furnished: 'Fully Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Gym', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 138,
  },
  {
    title: 'Contemporary 3 BHK Flat in Vasna-Bhayli',
    description: 'Spacious flat in newly completed premium gated community with clubhouse, infinity pool, tennis court, and kids play area. Facing landscaped central park.',
    type: 'Apartment',
    location: 'Bhayli Canal Road, Vasna-Bhayli, Vadodara',
    city: 'Vadodara',
    rent: 29000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1700,
    furnished: 'Semi Furnished',
    amenities: ['Parking', 'WiFi', 'AC', 'Gym', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 81,
  },
  {
    title: 'Stylish Studio Apartment near Sayaji Baug',
    description: 'Cozy modern studio with kitchenette, high speed broadband, washing machine, and sunlit balcony overlooking garden trees. 5 minutes from Vadodara Railway Station.',
    type: 'Studio',
    location: 'Near Sayaji Baug, Fatehgunj, Vadodara',
    city: 'Vadodara',
    rent: 16500,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    furnished: 'Fully Furnished',
    amenities: ['WiFi', 'AC', 'Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    views: 110,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentease';
    console.log(`Connecting to MongoDB for seeding at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await RentalRequest.deleteMany({});
    await Favorite.deleteMany({});

    console.log('Creating demo users...');
    // Demo Owner
    const ownerUser = await User.create({
      name: 'Rajesh Sharma (Owner)',
      email: 'owner@rentease.com',
      password: 'password123',
      phone: '+91 98250 12345',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    // Demo Renter
    const renterUser = await User.create({
      name: 'Priya Patel (Renter)',
      email: 'renter@rentease.com',
      password: 'password123',
      phone: '+91 98790 67890',
      role: 'renter',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    console.log(`✅ Demo users created:
      Owner:  owner@rentease.com  / password123
      Renter: renter@rentease.com / password123`);

    console.log('Inserting 13 sample properties across Gujarat...');
    const propertiesWithowner = sampleProperties.map((p) => ({
      ...p,
      ownerId: ownerUser._id,
    }));

    const createdProperties = await Property.insertMany(propertiesWithowner);
    console.log(`✅ ${createdProperties.length} properties created successfully!`);

    // Create sample rental request
    console.log('Creating sample rental requests...');
    const firstProp = createdProperties[0];
    const secondProp = createdProperties[1];

    await RentalRequest.create({
      propertyId: firstProp._id,
      renterId: renterUser._id,
      ownerId: ownerUser._id,
      message: 'Hello Mr. Sharma, I am relocating to Ahmedabad for an IT role and love this Bodakdev property. I would like to schedule a visit.',
      moveInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
      status: 'pending',
    });

    await RentalRequest.create({
      propertyId: secondProp._id,
      renterId: renterUser._id,
      ownerId: ownerUser._id,
      message: 'Hi Rajesh, interested in the 2 BHK near Vastrapur Lake. Moving in with family next month.',
      moveInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'accepted',
    });

    // Create sample favorite
    console.log('Creating sample favorites...');
    await Favorite.create({
      userId: renterUser._id,
      propertyId: firstProp._id,
    });
    await Favorite.create({
      userId: renterUser._id,
      propertyId: createdProperties[2]._id,
    });

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
}

seedDatabase();
