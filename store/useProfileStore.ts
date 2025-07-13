import { create } from "zustand";

interface Profile {
  id: string;
  name: string;
  email: string;
  username?: string;
  profile_picture?: string;
  role?: string;
  bio?: string;
  country?: string;
  language?: string;
  city?: string;
  isVerified?: boolean;
}

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
