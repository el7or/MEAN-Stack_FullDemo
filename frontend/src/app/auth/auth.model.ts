export interface AuthData {
  name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: User;
}

export interface User {
  name: string;
  password: string;
  age?: number;
  description?: string;
  roleId?: string;
  imageUrl?: string;
}
