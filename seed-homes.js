const mongoose = require('mongoose');
const Home = require('./models/home');

// MongoDB Atlas connection string
const DB_PATH = 'mongodb+srv://CRUDABC:CRUDABC@cluster1.vzxjvpm.mongodb.net/airbnb?appName=cluster1';

// Sample data for 15 homes with 4-5 relevant images each
const sampleHomes = [
  {
    houseName: 'Luxury Beach Villa',
    price: 15000,
    location: 'Mumbai',
    rating: 9.5,
    description: '4BHK beachfront villa with private pool and stunning ocean views',
    photos: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'
    ]
  },
  {
    houseName: 'Mountain Retreat Cottage',
    price: 8000,
    location: 'Shimla',
    rating: 8.8,
    description: '3BHK wooden cottage with panoramic mountain views and fireplace',
    photos: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800'
    ]
  },
  {
    houseName: 'Modern City Apartment',
    price: 5000,
    location: 'Delhi',
    rating: 7.5,
    description: '2BHK modern apartment near metro with all amenities',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800'
    ]
  },
  {
    houseName: 'Heritage Haveli Palace',
    price: 12000,
    location: 'Jaipur',
    rating: 9.0,
    description: 'Traditional Rajasthani haveli with royal architecture and courtyards',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'
    ]
  },
  {
    houseName: 'Backwater Houseboat',
    price: 6500,
    location: 'Kerala',
    rating: 8.5,
    description: 'Luxury houseboat cruise through Kerala backwaters with chef',
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ]
  },
  {
    houseName: 'Penthouse Suite',
    price: 20000,
    location: 'Mumbai',
    rating: 9.8,
    description: '5BHK penthouse with 360° sea view, private terrace and jacuzzi',
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    ]
  },
  {
    houseName: 'Tea Estate Bungalow',
    price: 11000,
    location: 'Darjeeling',
    rating: 9.0,
    description: 'Colonial-era bungalow surrounded by tea gardens with mountain views',
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
    ]
  },
  {
    houseName: 'Beachfront Shack',
    price: 4000,
    location: 'Goa',
    rating: 7.5,
    description: 'Cozy bamboo beach shack with direct beach access and hammocks',
    photos: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    ]
  },
  {
    houseName: 'Lake View Villa',
    price: 10000,
    location: 'Udaipur',
    rating: 9.3,
    description: '4BHK villa overlooking Pichola Lake with rooftop dining',
    photos: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800'
    ]
  },
  {
    houseName: 'Himalayan Homestay',
    price: 3000,
    location: 'Manali',
    rating: 8.2,
    description: '2BHK traditional homestay with Himalayan views and home-cooked meals',
    photos: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800'
    ]
  },
  {
    houseName: 'Royal Palace Suite',
    price: 25000,
    location: 'Udaipur',
    rating: 9.9,
    description: 'Stay in an actual palace with royal treatment and heritage experience',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800'
    ]
  },
  {
    houseName: 'Jungle Safari Lodge',
    price: 8500,
    location: 'Ranthambore',
    rating: 8.6,
    description: 'Eco-lodge near tiger reserve with guided safaris and nature walks',
    photos: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
    ]
  },
  {
    houseName: 'Corporate Serviced Suite',
    price: 7000,
    location: 'Bangalore',
    rating: 8.0,
    description: '2BHK fully serviced apartment with workspace and high-speed internet',
    photos: [
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ]
  },
  {
    houseName: 'Desert Camp Luxury Tent',
    price: 7500,
    location: 'Jaisalmer',
    rating: 8.7,
    description: 'Luxury tent in Thar desert with cultural programs and camel safari',
    photos: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800'
    ]
  },
  {
    houseName: 'Riverside Yoga Retreat',
    price: 4500,
    location: 'Rishikesh',
    rating: 8.0,
    description: '2BHK cottage by Ganges with yoga classes and meditation sessions',
    photos: [
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
    ]
  }
];

// Connect to MongoDB and seed data
mongoose.connect(DB_PATH)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return Home.deleteMany({}); // Clear existing homes
  })
  .then(() => {
    console.log('Cleared existing homes');
    return Home.insertMany(sampleHomes);
  })
  .then((result) => {
    console.log(`Successfully added ${result.length} homes to the database!`);
    console.log('Sample homes:');
    result.forEach((home, index) => {
      console.log(`${index + 1}. ${home.houseName} - ${home.location} - ₹${home.price} - ${home.photos.length} photos`);
    });
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  });
