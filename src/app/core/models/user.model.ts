export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  role_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  auth_items: any; 
}