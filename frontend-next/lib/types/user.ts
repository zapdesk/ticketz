export interface User {
  id: string;
  name: string;
  email: string;
  profile: string;
  companyId: string;
  company?: {
    id: string;
    name: string;
    dueDate?: string;
    settings?: Array<{
      key: string;
      value: string;
    }>;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 