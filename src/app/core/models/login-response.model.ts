export interface LoginResponse {
  access_token: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';  
    createdAt: string;
    isActive: boolean;
  };
  message: string;
}
