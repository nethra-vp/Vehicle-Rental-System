const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');

dotenv.config();

const vehicles = [
  {
    make: 'Tata',
    model: 'Nexon EV',
    year: 2024,
    pricePerDay: 2500,
    location: 'Bengaluru',
    images: ['https://cdni.autocarindia.com/ExtraImages/20230111054032_Tata_Nexon_EV_Max.jpg'],
    features: ['Electric', 'Fast Charging', 'Connected Car Tech']
  },
  {
    make: 'Mahindra',
    model: 'Thar',
    year: 2023,
    pricePerDay: 3000,
    location: 'Mysuru',
    images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/40087/thar-exterior-right-front-three-quarter.jpeg'],
    features: ['4x4', 'Convertible Roof', 'Off-road Capability']
  },
  {
    make: 'Toyota',
    model: 'Innova Crysta',
    year: 2022,
    pricePerDay: 3500,
    location: 'Mangaluru',
    images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter.jpeg'],
    features: ['Spacious', 'Diesel Engine', 'Comfort Ride']
  },
  {
    make: 'Hyundai',
    model: 'Creta',
    year: 2024,
    pricePerDay: 2800,
    location: 'Hubballi',
    images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/131825/creta-exterior-right-front-three-quarter-16.jpeg'],
    features: ['Panoramic Sunroof', 'ADAS', 'Touchscreen Infotainment']
  },
  {
    make: 'Kia',
    model: 'Seltos',
    year: 2023,
    pricePerDay: 2700,
    location: 'Belagavi',
    images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/144527/seltos-exterior-right-front-three-quarter.jpeg'],
    features: ['Ventilated Seats', 'BOSE Sound System', 'Smart Connectivity']
  },
  {
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2022,
    pricePerDay: 1500,
    location: 'Shivamogga',
    images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/124839/swift-exterior-right-front-three-quarter.jpeg'],
    features: ['Fuel Efficient', 'Compact', 'Easy Handling']
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Vehicle.deleteMany();
        await Vehicle.insertMany(vehicles);
        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
