import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import * as userService from "../services/user";
import { setupInterceptors } from "../services/interceptor";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!accessToken;

  const fetchUser = async (token) => {
    const res = await userService.getUser(token);
    setUser(res);
  };

  const setSession = async (token) => {
    setAccessToken(token);
    await fetchUser(token);
  };

  const login = async (data) => {
    const res = await authService.login(data);
    await setSession(res.access_token);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}

    setAccessToken(null);
    setUser(null);
  };

  const refresh = async () => {
    const res = await authService.refresh();
    await setSession(res.access_token);
    return res.access_token;
  };

  useEffect(() => {
    const { requestInterceptor, responseInterceptor } = setupInterceptors({
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
        setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
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
