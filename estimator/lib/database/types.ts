// User role types
export type UserRole = 'customer' | 'internal' | 'admin';

// Profile type
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Database schema type
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Functions: {
      has_role: {
        Args: { required_role: UserRole };
        Returns: boolean;
      };
      get_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
    };
  };
};
