import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { auth } from '../constants';

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

const getExpirationDate = (jwt) => {
  if (!jwt) {
      return null;
  }

  const claims = JSON.parse(atob(jwt.split('.')[1]));

  // multiply by 1000 to convert seconds into milliseconds
  return claims && claims.exp && claims.exp * 1000 || null;
};

const getName = (jwt) => {
  if (!jwt) return null;
  const claims = JSON.parse(atob(jwt.split('.')[1]));
  return claims && claims.name;
};

const isExpired = (exp) => {
  if (!exp) {
      return false;
  }

  return Date.now() > exp;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [authTokens, setAuthTokens] = useState();

  const getTokens = () => {
    return JSON.parse(localStorage.getItem("tokens"));
  };
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  useEffect(() => {
    const initAuth = () => {
      const existingTokens = getTokens();
      if (existingTokens && existingTokens.refresh) {
        if (isExpired(getExpirationDate(existingTokens.refresh))) {
          logout();
        } else {
          setIsAuthenticated(true);
          setAuthTokens(existingTokens);
          const user = getName(existingTokens.refresh);
          setUser(user);
        }
      }
  
      setLoading(false);
    };
    initAuth();
    

  }, []);

  const login = (username, password) => {
    setLoading(true);
    axios.post(auth.loginUrl, {
      username,
      password
    }).then(result => {
      if (result.status === 200) {
        setTokens(result.data);
        setIsAuthenticated(true);
        setError(null);
        setLoading(false);
        setUser(getName(result.data.access))
      } else if (result.status === 401) {
        setIsAuthenticated(false);
        setError('invalid username or password');
        setLoading(false); 
      }
    }).catch(e => {
      console.log({loginError: e})
      setIsAuthenticated(false);
      setError('invalid username or password, try again');
      setLoading(false);
    });
  }

  const logout = () => {
    setIsAuthenticated(false);
    setTokens({});
    setUser(null);
  }

  // const refreshToken = () => {

  // }

  const getAccessToken = async () => {
    if (!authTokens) return null;
    if (isExpired(getExpirationDate(authTokens.access))) {
      console.log('access token expired')
      // get new accesstoken 
      try {
        const resp = await axios.post(auth.loginUrl + 'refresh/', { refresh: authTokens.refresh});
        if (resp.status === 200) {
          console.log('token refreshed');
          setTokens({refresh: authTokens.refresh, access: resp.data.access});
          return resp.data.access;
        } else if (resp.status === 401) {
          // token invalid or expired, force logout
          // TODO: call logout
          logout();
          console.log('invalid token')
        }
      } catch (e) {
        console.log({error: e})
        setError(e);
        return null;
      }
    } else {
      return authTokens.access;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        getAccessToken,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}