import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getAuthToken, getAuthUser } from './auth';

export function useAuthGuard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const token = await getAuthToken();
      const userData = await getAuthUser();

      if (!token || !userData) {
        setIsAuthenticated(false);
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
        setUser(userData);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated, user };
}
