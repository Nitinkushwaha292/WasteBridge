const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wastebridge';

// ── Schemas (no enum restrictions for seeding) ────────
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  collectorType: { type: String, default: null },
  organization: String,
  phone: String,
  verified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: true },
  bio: String,
  website: String,
  location: { city: String, state: String, country: String },
  totalImpact: {
    wasteCollected: { type: Number, default: 0 },
    co2Saved: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

const listingSchema = new mongoose.Schema({
  title: String, description: String,
  wasteType: String, source: String,
  quantity: Number, pricePerKg: Number, totalPrice: Number,
  location: {
    address: String, city: String, state: String, pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  images: [String],
  status: { type: String, default: 'available' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  urgency: { type: String, default: 'medium' },
  tags: [String],
  availableTill: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Clear cached models
if (mongoose.models.User) delete mongoose.models.User;
if (mongoose.models.Listing) delete mongoose.models.Listing;

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);

// ── Seed Users ────────────────────────────────────────
const COLLECTOR_USERS = [
  {
    name: 'Ravi Sharma',
    email: 'ravi@cleanyamuna.org',
    role: 'collector',
    collectorType: 'ngo',
    organization: 'Clean Yamuna Foundation',
    phone: '9876543210',
    verified: true,
    isEmailVerified: true,
    bio: 'We have cleaned 50+ km of Yamuna river bank since 2019.',
    location: { city: 'Delhi', state: 'Delhi', country: 'India' }
  },
  {
    name: 'Priya Singh',
    email: 'priya@mumbaibeach.org',
    role: 'collector',
    collectorType: 'ngo',
    organization: 'Mumbai Beach Warriors',
    phone: '9123456780',
    verified: true,
    isEmailVerified: true,
    bio: 'Protecting Mumbai coastline one cleanup at a time.',
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  },
  {
    name: 'Arjun Das',
    email: 'arjun@greenganga.org',
    role: 'collector',
    collectorType: 'volunteer',
    organization: 'Green Ganga Volunteers',
    phone: '9988776655',
    verified: false,
    isEmailVerified: true,
    bio: 'Volunteer group dedicated to restoring the Ganga river ecosystem.',
    location: { city: 'Varanasi', state: 'Uttar Pradesh', country: 'India' }
  },
  {
    name: 'Meera Patel',
    email: 'meera@ecoamdavad.org',
    role: 'collector',
    collectorType: 'ngo',
    organization: 'Eco Amdavad',
    phone: '9871234560',
    verified: true,
    isEmailVerified: true,
    bio: 'Urban waste management across Ahmedabad city.',
    location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' }
  },
  {
    name: 'Nitin Kushwaha',
    email: 'kushwahanitin696499@gmail.com',
    role: 'collector',
    collectorType: 'individual',
    organization: 'GreenTimes',
    phone: '9993464460',
    verified: true,
    isEmailVerified: true,
    bio: 'Individual collector working on local waste management.',
    location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' }
  },
];

const RECYCLER_USERS = [
  {
    name: 'Vikram Joshi',
    email: 'vikram@ecoplast.com',
    role: 'recycler',
    collectorType: null,
    organization: 'EcoPlast Industries',
    phone: '9871234567',
    verified: true,
    isEmailVerified: true,
    bio: 'We convert plastic waste into pellets for manufacturing.',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },
  {
    name: 'Sunita Rao',
    email: 'sunita@greenmetals.com',
    role: 'recycler',
    collectorType: null,
    organization: 'GreenMetals Pvt Ltd',
    phone: '9765432109',
    verified: true,
    isEmailVerified: true,
    bio: 'Metal recycling with 20 years of experience.',
    location: { city: 'Bangalore', state: 'Karnataka', country: 'India' }
  },
];

// ── Seed Listings ─────────────────────────────────────
const LISTINGS_DATA = [
  {
    title: '800kg PET Plastic Bottles from Yamuna River Cleanup',
    description: 'High quality PET plastic bottles collected from a 12km stretch of Yamuna river. Cleaned, sorted and baled. Ready for immediate pickup.',
    wasteType: 'plastic', source: 'river', quantity: 800, pricePerKg: 14,
    urgency: 'high', tags: ['PET', 'sorted', 'river', 'baled'],
    location: { address: 'Yamuna Bank, Near ITO Bridge', city: 'Delhi', state: 'Delhi', pincode: '110002', coordinates: { lat: 28.6289, lng: 77.2442 } },
    availableTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    collectorEmail: 'ravi@cleanyamuna.org'
  },
  {
    title: '300kg HDPE Plastic Cans — Ocean Beach Haul',
    description: 'HDPE containers collected from Juhu and Versova beach cleanup. Mixed colors but single polymer type.',
    wasteType: 'plastic', source: 'ocean', quantity: 300, pricePerKg: 12,
    urgency: 'medium', tags: ['HDPE', 'ocean', 'beach'],
    location: { address: 'Juhu Beach Cleanup Point', city: 'Mumbai', state: 'Maharashtra', pincode: '400049', coordinates: { lat: 19.0988, lng: 72.8260 } },
    availableTill: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    collectorEmail: 'priya@mumbaibeach.org'
  },
  {
    title: '1200kg Mixed Metal Scrap from Industrial Cleanup',
    description: 'Mixed metal scrap including aluminium, iron and copper collected from abandoned industrial area.',
    wasteType: 'metal', source: 'industrial', quantity: 1200, pricePerKg: 28,
    urgency: 'low', tags: ['aluminium', 'iron', 'copper'],
    location: { address: 'Industrial Area, Sector 5', city: 'Ahmedabad', state: 'Gujarat', pincode: '382405', coordinates: { lat: 23.0225, lng: 72.5714 } },
    availableTill: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    collectorEmail: 'meera@ecoamdavad.org'
  },
  {
    title: '500kg Cardboard & Newspaper from Residential Drive',
    description: 'Clean dry cardboard boxes and newspapers collected from door-to-door drive. Bundled in 20kg lots.',
    wasteType: 'paper', source: 'household', quantity: 500, pricePerKg: 8,
    urgency: 'medium', tags: ['cardboard', 'newspaper', 'dry'],
    location: { address: 'Indiranagar, 100ft Road', city: 'Bangalore', state: 'Karnataka', pincode: '560038', coordinates: { lat: 12.9784, lng: 77.6408 } },
    collectorEmail: 'meera@ecoamdavad.org'
  },
  {
    title: '150kg E-Waste: Computers, Phones & Circuit Boards',
    description: 'Electronic waste from office donation drives. Includes desktops, laptops, phones and batteries.',
    wasteType: 'electronic', source: 'household', quantity: 150, pricePerKg: 22,
    urgency: 'high', tags: ['ewaste', 'computers', 'phones'],
    location: { address: 'Sector 18, Near Metro Station', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', coordinates: { lat: 28.5706, lng: 77.3219 } },
    availableTill: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    collectorEmail: 'ravi@cleanyamuna.org'
  },
  {
    title: '600kg Ganga River Plastic — Mixed Types Post Flood',
    description: 'Plastic waste collected post monsoon from Ganga banks near Varanasi ghats. Mixed types.',
    wasteType: 'plastic', source: 'river', quantity: 600, pricePerKg: 9,
    urgency: 'high', tags: ['Ganga', 'post-flood', 'mixed-plastic'],
    location: { address: 'Assi Ghat, Ganga Riverbank', city: 'Varanasi', state: 'Uttar Pradesh', pincode: '221005', coordinates: { lat: 25.2677, lng: 82.9913 } },
    availableTill: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    collectorEmail: 'arjun@greenganga.org'
  },
  {
    title: '400kg Old Clothes & Textile Scraps from Donation Camp',
    description: 'Used clothing and fabric scraps from community donation camp. Cotton, polyester and blends.',
    wasteType: 'textile', source: 'household', quantity: 400, pricePerKg: 6,
    urgency: 'low', tags: ['clothing', 'fabric', 'cotton'],
    location: { address: 'Dharavi Community Center', city: 'Mumbai', state: 'Maharashtra', pincode: '400017', coordinates: { lat: 19.0437, lng: 72.8538 } },
    collectorEmail: 'priya@mumbaibeach.org'
  },
  {
    title: '250kg Clear Glass Bottles from Beach Cleanup',
    description: 'Clear and amber glass bottles from Marine Drive and Chowpatty beach. Sorted by color.',
    wasteType: 'glass', source: 'ocean', quantity: 250, pricePerKg: 5,
    urgency: 'medium', tags: ['glass', 'bottles', 'beach', 'sorted'],
    location: { address: 'Marine Drive, Near Nariman Point', city: 'Mumbai', state: 'Maharashtra', pincode: '400020', coordinates: { lat: 18.9438, lng: 72.8232 } },
    collectorEmail: 'priya@mumbaibeach.org'
  },
  {
    title: '2000kg Landfill Plastic Recovery — Ghazipur Site',
    description: 'Large quantity plastic from Ghazipur landfill. Mix of packaging, bags, bottles and film.',
    wasteType: 'plastic', source: 'landfill', quantity: 2000, pricePerKg: 7,
    urgency: 'medium', tags: ['Ghazipur', 'landfill', 'bulk'],
    location: { address: 'Ghazipur Landfill Site, NH24', city: 'Delhi', state: 'Delhi', pincode: '110096', coordinates: { lat: 28.6274, lng: 77.3297 } },
    availableTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    collectorEmail: 'ravi@cleanyamuna.org'
  },
  {
    title: '350kg Organic Waste for Composting — Fruit Market',
    description: 'Fresh organic waste from APMC market. Good for biogas plants or composting units.',
    wasteType: 'organic', source: 'other', quantity: 350, pricePerKg: 2,
    urgency: 'high', tags: ['organic', 'fruit', 'composting', 'biogas'],
    location: { address: 'APMC Market, Vashi', city: 'Mumbai', state: 'Maharashtra', pincode: '400703', coordinates: { lat: 19.0748, lng: 72.9990 } },
    availableTill: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    collectorEmail: 'priya@mumbaibeach.org'
  },
];

// ── Main Seed Function ────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const password = await bcrypt.hash('test123', 12);

    const collectorUsers = await User.insertMany(
      COLLECTOR_USERS.map(u => ({ ...u, password }))
    );
    console.log(`✅ Created ${collectorUsers.length} collector users`);

    const recyclerUsers = await User.insertMany(
      RECYCLER_USERS.map(u => ({ ...u, password }))
    );
    console.log(`✅ Created ${recyclerUsers.length} recycler users`);

    await User.create({
      name: 'Admin User',
      email: 'admin@wastebridge.com',
      password,
      role: 'admin',
      collectorType: null,
      organization: 'WasteBridge',
      verified: true,
      isEmailVerified: true,
      location: { city: 'Delhi', state: 'Delhi', country: 'India' }
    });
    console.log('✅ Created admin user');

    const allUsers = [...collectorUsers, ...recyclerUsers];
    const getUserByEmail = (email) => allUsers.find(u => u.email === email);

    const listingsToInsert = LISTINGS_DATA.map(l => {
      const { collectorEmail, ...rest } = l;
      const collector = getUserByEmail(collectorEmail);
      return {
        ...rest,
        totalPrice: l.quantity * l.pricePerKg,
        postedBy: collector?._id,
        status: 'available'
      };
    });

    const createdListings = await Listing.insertMany(listingsToInsert);
    console.log(`✅ Created ${createdListings.length} waste listings`);

    console.log('\n═══════════════════════════════════════════');
    console.log('🎉 Database seeded successfully!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📋 TEST ACCOUNTS (password: test123)');
    console.log('───────────────────────────────────────────');
    console.log('👤 ADMIN');
    console.log('   admin@wastebridge.com');
    console.log('\n🌊 COLLECTOR ACCOUNTS');
    COLLECTOR_USERS.forEach(u => {
      console.log(`   [${u.collectorType.toUpperCase()}] ${u.email}`);
    });
    console.log('\n🏭 RECYCLER ACCOUNTS');
    RECYCLER_USERS.forEach(u => {
      console.log(`   ${u.email}`);
    });
    console.log('\n🚀 Go to http://localhost:3000/listings');
    console.log('═══════════════════════════════════════════\n');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();