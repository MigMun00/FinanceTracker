import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import { setupInterceptors } from "../services/interceptor";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!accessToken;

  const login = async (data) => {
    const res = await authService.login(data);
    setAccessToken(res.access_token);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}
    setAccessToken(null);
  };

  const refresh = async () => {
    const res = await authService.refresh();
    setAccessToken(res.access_token);
    return res.access_token;
  };

  useEffect(() => {
    setupInterceptors({
      get accessToken() {
        return accessToken;
      },
      refresh,
      logout,
    });

    const initAuth = async () => {
      try {
        await refresh();
      } catch (e) {
        setAccessToken(null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        initialized,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
