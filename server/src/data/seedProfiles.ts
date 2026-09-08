import { Profile, CurrentUser } from '../types';

export const initialCurrentUser: CurrentUser = {
  id: 'user_me',
  name: 'Dev',
  email: 'dev@miora.app',
  age: 23,
  dateOfBirth: '2001-05-14',
  gender: 'man',
  location: 'Bangalore, India',
  bio: 'Product designer obsessed with aesthetics, indie music, slow coffee, and weekend getaways. Looking for someone genuine to share cozy café moments with.',
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  ],
  interests: ['Music', 'Travel', 'Movies', 'Photography', 'Food'],
  profileCompletion: 85,
  preferences: {
    interestedIn: 'women',
    ageRange: { min: 18, max: 28 },
    maxDistanceKm: 25,
    location: 'Bangalore'
  }
};

export const seedProfiles: Profile[] = [
  {
    id: 'prof_1',
    name: 'Priya',
    age: 22,
    location: 'Chennai, India',
    distanceKm: 4,
    bio: 'Love music, coffee, travel and discovering cozy aesthetic places. Currently designing delightful apps by day and exploring indie vinyl records by night ☕✨',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Music', 'Travel', 'Movies', 'Coffee', 'Design', 'Art'],
    compatibility: 87,
    online: true,
    gender: 'woman',
    occupation: 'UI/UX Designer',
    education: 'NIFT Chennai',
    height: "5'5\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      workout: 'Yoga & Pilates',
      zodiac: 'Taurus'
    },
    matchedInterests: ['Music', 'Travel', 'Movies', 'Design']
  },
  {
    id: 'prof_2',
    name: 'Ananya',
    age: 21,
    location: 'Hyderabad, India',
    distanceKm: 8,
    bio: 'Architecture student who lives for sunset drives, live acoustic gigs, and secret dessert spots. Let’s talk about our favorite playlists! 🎨🎧',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Art', 'Music', 'Food', 'Travel', 'Photography'],
    compatibility: 92,
    online: true,
    gender: 'woman',
    occupation: 'Architecture Student',
    education: 'JNAFAU Hyderabad',
    height: "5'4\"",
    lifestyle: {
      drinking: 'Never',
      smoking: 'Never',
      workout: 'Often',
      zodiac: 'Libra'
    },
    matchedInterests: ['Art', 'Music', 'Food', 'Travel']
  },
  {
    id: 'prof_3',
    name: 'Meera',
    age: 23,
    location: 'Bangalore, India',
    distanceKm: 3,
    bio: 'Building tech startups & bingeing Studio Ghibli. Obsessed with golden retriever energy, rainy rooftop cafes, and spicy street food 🍜🐕',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Gaming', 'Pets', 'Food', 'Travel', 'Movies', 'Tech'],
    compatibility: 95,
    online: false,
    gender: 'woman',
    occupation: 'Software Engineer',
    education: 'PES University',
    height: "5'6\"",
    lifestyle: {
      drinking: 'Occasionally',
      smoking: 'Never',
      workout: 'Gym 4x/week',
      zodiac: 'Cancer'
    },
    matchedInterests: ['Food', 'Travel', 'Movies', 'Pets']
  },
  {
    id: 'prof_4',
    name: 'Ishita',
    age: 22,
    location: 'Mumbai, India',
    distanceKm: 12,
    bio: 'Film photographer & writer. If you have recommendations for vintage bookshops or quirky art galleries, I’m all ears 📸🎞️',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Photography', 'Reading', 'Art', 'Movies', 'Music'],
    compatibility: 84,
    online: true,
    gender: 'woman',
    occupation: 'Editorial Photographer',
    education: 'St. Xavier’s Mumbai',
    height: "5'7\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Socially',
      workout: 'Active lifestyle',
      zodiac: 'Pisces'
    },
    matchedInterests: ['Photography', 'Reading', 'Art', 'Movies']
  },
  {
    id: 'prof_5',
    name: 'Rahul',
    age: 24,
    location: 'Chennai, India',
    distanceKm: 6,
    bio: 'Fintech analyst, amateur guitarist and fitness geek. Always down for spontaneous coastal highway roadtrips and midnight ice cream runs 🎸🌊',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Music', 'Fitness', 'Travel', 'Food', 'Gaming'],
    compatibility: 81,
    online: false,
    gender: 'man',
    occupation: 'Fintech Analyst',
    education: 'Loyola College',
    height: "6'0\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      workout: 'Crossfit daily',
      zodiac: 'Leo'
    },
    matchedInterests: ['Music', 'Fitness', 'Travel', 'Food']
  },
  {
    id: 'prof_6',
    name: 'Arjun',
    age: 25,
    location: 'Bangalore, India',
    distanceKm: 5,
    bio: 'Leading product design for creative tools. Passionate about sourdough baking, specialty pourovers, and mountain hiking trails ☕🏔️',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Travel', 'Food', 'Art', 'Music', 'Fitness'],
    compatibility: 89,
    online: true,
    gender: 'man',
    occupation: 'Staff Product Designer',
    education: 'IIT Guwahati',
    height: "5'11\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      workout: 'Climbing & Running',
      zodiac: 'Sagittarius'
    },
    matchedInterests: ['Travel', 'Food', 'Art']
  },
  {
    id: 'prof_7',
    name: 'Sneha',
    age: 22,
    location: 'Pune, India',
    distanceKm: 14,
    bio: 'Psychology student, pottery enthusiast, and cat mom. Fluent in sarcasm, Taylor Swift lyrics, and comfort food recipes 🌸🐈',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Pets', 'Art', 'Music', 'Reading', 'Food'],
    compatibility: 91,
    online: true,
    gender: 'woman',
    occupation: 'Psychology Masters Student',
    education: 'Fergusson College',
    height: "5'3\"",
    lifestyle: {
      drinking: 'Never',
      smoking: 'Never',
      workout: 'Pilates',
      zodiac: 'Virgo'
    },
    matchedInterests: ['Pets', 'Art', 'Music']
  }
];
