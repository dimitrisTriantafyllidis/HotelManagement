import React, { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'Admin' | 'Manager' | 'User';

interface AuthUser {
  token: string;
  roles: UserRole[];
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (...roles: UserRole[]) => boolean;
  login: (data: { token: string; roles: string[]; fullName: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  hasRole: () => false,
  hasAnyRole: () => false,
  login: () => {},
  logout: () => {},
});

function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function loadUserFromStorage(): AuthUser | null {
  const token = localStorage.getItem('token');
  const rolesStr = localStorage.getItem('roles');
  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    return null;
  }

  return {
    token,
    roles: rolesStr ? JSON.parse(rolesStr) : [],
    fullName: fullName || '',
    email: email || '',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage);

  const login = useCallback((data: { token: string; roles: string[]; fullName: string; email: string }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('roles', JSON.stringify(data.roles));
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('email', data.email);

    setUser({
      token: data.token,
      roles: data.roles as UserRole[],
      fullName: data.fullName,
      email: data.email,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    setUser(null);
  }, []);

  const hasRole = useCallback((role: UserRole) => user?.roles.includes(role) ?? false, [user]);
  const hasAnyRole = useCallback((...roles: UserRole[]) => roles.some(r => user?.roles.includes(r)) ?? false, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      hasRole,
      hasAnyRole,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
