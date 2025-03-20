export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEmailVerified: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginData {
  email?: string;
  phone?: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface WebSocketMessage {
  event: string;
  data: {
    success: boolean;
    message: string;
    user?: User;
  };
} 