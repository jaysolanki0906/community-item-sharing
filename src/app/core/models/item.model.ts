export interface Item {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string | null;
  status: string;
  createdAt?: string;
  userId?: string;
}
