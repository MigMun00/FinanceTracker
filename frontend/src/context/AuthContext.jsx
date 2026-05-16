import { useCallback, useEffect, useState } from "react";
import * as authService from "../services/auth";
import * as userService from "../services/user";
import { setupInterceptors } from "../services/interceptor";
import api from "../services/api";
import AuthContext from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!accessToken;

  const fetchUser = useCallback(async (token) => {
    const res = await userService.getUser(token);
    setUser(res);
  }, []);

  const setSession = useCallback(async (token) => {
    setAccessToken(token);
    await fetchUser(token);
  }, [fetchUser]);

  const login = async (data) => {
    const res = await authService.login(data);
    await setSession(res.access_token);
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout failures and always clear local session.
    }

    setAccessToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const res = await authService.refresh();
    await setSession(res.access_token);
    return res.access_token;
  }, [setSession]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refresh();
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [refresh]);

  useEffect(() => {
    const { requestInterceptor, responseInterceptor } = setupInterceptors({
      get accessToken() {
        return accessToken;
      },
      refresh,
      logout,
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, logout, refresh]);

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
