
export interface GavaConnectUserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profilePictureUrl?: string;
  roles: string[];
}