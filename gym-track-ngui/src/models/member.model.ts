export type PlanType = 'basic' | 'standard' | 'premium';

export interface Member {
  _id?: string; // MongoDB adds this automatically

  name: string;
  email: string;
  password: string;
  phone: string;

  profilePicture?: string;
  imageKitFileId?: string;

  plan: PlanType;

  joinDate?: Date;
  expiryDate: Date;

  isActive?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
