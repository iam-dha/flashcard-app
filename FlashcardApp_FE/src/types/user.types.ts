export interface UserTypes {
  username: string;
  email: string;
  hashedPassword: string;
}

export interface RegisterRequestTypes {
  email: string;
  password: string;
  username: string;
  otp: string;
  address?: string;
  phone?: string;
}

export interface LoginRequestTypes {
  email: string;
  password: string;
}

export interface AuthResponseTypes {
  status: string;
  accessToken: string;
  role: string;
  user: UserTypes;
}