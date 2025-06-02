export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  role_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  auth_items: {
    id: string;
    name: string;
    auth_items: {
      [module: string]: {
        [permission: string]: boolean;
      };
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}
