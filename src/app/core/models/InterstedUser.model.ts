interface InterestedUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  interestedOn: string;
  originalUser: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    isActive: boolean;
  };
}