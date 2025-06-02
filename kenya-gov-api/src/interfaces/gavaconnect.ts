// filepath: /kenya-gov-api/kenya-gov-api/src/interfaces/gavaconnect.ts

export interface GavaConnectUserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profilePictureUrl?: string;
  roles: string[];
}