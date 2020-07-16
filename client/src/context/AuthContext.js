import { createContext } from 'react';

export const AuthContext = createContext({
  email: null,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});
