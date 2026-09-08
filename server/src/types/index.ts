export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  distanceKm: number;
  bio: string;
  photos: string[];
  interests: string[];
  compatibility: number; // Percentage, e.g. 88
  online: boolean;
  gender: 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
  occupation?: string;
  education?: string;
  height?: string;
  lifestyle?: {
    drinking?: string;
    smoking?: string;
    workout?: string;
    zodiac?: string;
  };
  matchedInterests?: string[];
  likedByCurrentUser?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  age: number;
  dateOfBirth?: string;
  gender: 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  profileCompletion: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  interestedIn: 'women' | 'men' | 'everyone';
  ageRange: {
    min: number;
    max: number;
  };
  maxDistanceKm: number;
  location: string;
}

export interface Match {
  id: string;
  profileId: string;
  profile: Profile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string; // 'me' or profileId
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  targetProfileId: string;
  targetProfileName: string;
  reason: string;
  details?: string;
  createdAt: string;
}

export interface BlockItem {
  id: string;
  profileId: string;
  profileName: string;
  profilePhoto: string;
  blockedAt: string;
}
