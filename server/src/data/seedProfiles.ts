import { Profile, CurrentUser } from '../types';

export const initialCurrentUser: CurrentUser = {
  id: 'user_me',
  name: 'MIORA User',
  email: '',
  age: 18,
  gender: 'prefer-not-to-say',
  location: '',
  bio: '',
  photos: [],
  interests: [],
  profileCompletion: 0,
  preferences: {
    interestedIn: 'women',
    ageRange: { min: 18, max: 50 },
    maxDistanceKm: 50,
    location: ''
  }
};

export const seedProfiles: Profile[] = [];
