import { useState, useCallback, useEffect } from 'react';

const storageAppName = 'exRateData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  const login = useCallback((jwtToken, id, userEmail) => {
    setToken(jwtToken);
    setUserId(jwtToken);
    setEmail(userEmail);
    localStorage.setItem(
      storageAppName,
      JSON.stringify({
        token: jwtToken,
        userId: id,
        email: userEmail,
      })
    );
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(storageAppName);
    setToken(null);
    setUserId(null);
    setEmail(null);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageAppName));

    if (data && data.token) {
      login(data.token, data.userId, data.email);
    }
  }, [login]);

  return { email, token, userId, login, logout };
};
