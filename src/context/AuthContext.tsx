import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  subscribeToAuthState,
  login as authLogin,
  logout as authLogout,
} from '../services/authService';
import { USERS } from '../config/constants';
import {
  registerForPushNotifications,
  savePushToken,
} from '../services/notificationService';

interface AuthContextType {
  userId: string | null;
  partnerId: string | null;
  userName: string | null;
  partnerName: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (id) => {
      setUserId(id);
      setIsLoading(false);

      // Register for push notifications when user logs in
      if (id) {
        const token = await registerForPushNotifications();
        if (token) {
          await savePushToken(id, token);
        }
      }
    });
    return unsubscribe;
  }, []);

  const partnerId =
    userId === 'user1' ? 'user2' : userId === 'user2' ? 'user1' : null;
  const userName = userId
    ? USERS[userId as keyof typeof USERS]?.name
    : null;
  const partnerName = partnerId
    ? USERS[partnerId as keyof typeof USERS]?.name
    : null;

  const handleLogin = async (email: string, password: string) => {
    await authLogin(email, password);
  };

  const handleLogout = async () => {
    await authLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        partnerId,
        userName,
        partnerName,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
