type IUser = {
  id: string;
  email: string;
  avatarUrl: string;
  firstname: string;
  lastname: string;
  userId: string;
  role: string;
  username: string;
  verifications?: object;
  createdAt: string;
  isActive?: boolean;
};

export type { IUser };
