import React, { createContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  apartmentNumber?: string;
  role?: 'admin' | 'resident' | 'staff';
  password?: string;
};

type UserRole = 'admin' | 'resident' | 'staff';

type PendingUser = {
  id: string;
  name: string;
  email: string;
  apartmentNumber?: string;
  role: UserRole;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, apartmentNumber: string, role: UserRole) => Promise<void>;
  logout: () => void;
  pendingUsers: PendingUser[];
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  approvedUsers: User[];
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);

  // Simulate loading user data
  useEffect(() => {
    // In a real app, you would check for stored credentials or tokens
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo accounts for testing
      let userData: User | null = null;
      let role: UserRole | null = null;
      
      // Check if user is pending approval
      const pending = pendingUsers.find(u => u.email === email);
      if (pending) {
        throw new Error('Your account is pending admin approval.');
      }
      
      // Check approved users
      const approved = approvedUsers.find(
        u => u.email === email && u.password === password
      );
      if (approved) {
        setUser(approved);
        if (approved.role) {
          setUserRole(approved.role);
        } else {
          setUserRole(null);
        }
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      if (email === 'admin@example.com' && password === 'password123') {
        userData = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        };
        role = 'admin';
      } else if (email === 'resident@example.com' && password === 'password123') {
        userData = {
          id: '2',
          name: 'John Resident',
          email: 'resident@example.com',
          apartmentNumber: '304',
          role: 'resident',
        };
        role = 'resident';
      } else if (email === 'staff@example.com' && password === 'password123') {
        userData = {
          id: '3',
          name: 'Staff Member',
          email: 'staff@example.com',
          role: 'staff',
        };
        role = 'staff';
      } else {
        throw new Error('Invalid credentials');
      }
      
      setUser(userData);
      setUserRole(role);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, apartmentNumber: string, role: UserRole) => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // Add to pending users for admin approval (for both resident and staff)
      setPendingUsers(prev => [
        ...prev,
        { id: Date.now().toString(), name, email, apartmentNumber, role, password }
      ]);
      // Show message: "Please wait for admin approval..."
      return;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = (id: string) => {
    const userToApprove = pendingUsers.find(u => u.id === id);
    if (userToApprove) {
      // In a real app, add to users DB
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      setApprovedUsers(prev => [
        ...prev,
        {
          id: userToApprove.id,
          name: userToApprove.name,
          email: userToApprove.email,
          apartmentNumber: userToApprove.apartmentNumber,
          role: userToApprove.role,
          password: userToApprove.password,
        }
      ]);
      // Optionally, notify the user
    }
  };

  const rejectUser = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    // Optionally, notify the user
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        pendingUsers,
        approveUser,
        rejectUser,
        approvedUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}