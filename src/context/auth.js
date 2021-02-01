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
  return (claims && claims.exp && claims.exp * 1000) || null;
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
    try {
      return JSON.parse(localStorage.getItem("tokens"));
    } catch (e) {
      return null;
    }
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
          setIsAuthenticated(false);
          setTokens({});
          setUser(null);
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

  const requestOTP = async (number) => {
    setError(null);
    setLoading(true);
    const form = new FormData();
    form.append('phone', number);
    try {
      const resp = await axios.post(auth.sendOTPUrl, form)
      setLoading(false);
      if (resp.status === 200) {
        if (resp.data.message.indexOf('maximum attempt') > -1) {
          // maximum attempts reached
          setError(resp.data.message)
          setLoading(false);
          return null;
        }
        return resp.data;
      }
    } catch (e) {
      if (e.response.status === 500) {
        setError('Phone number is not registered with profcon.in')
      } else {
        setError('Unknown error occured, please refresh and try again!')
      }
    }
    setLoading(false);
    return null;
  }

  const verifyOTP = (number, otp) => {
    setError(null);
    setLoading(true);
    const form = new FormData();
    form.append('phone', number);
    form.append('otp', otp);
    axios.post(auth.verifyOTPUrl, form).then(
      result => {
        if (result.status === 200) {
          if (result.data.status === 6001) {
            setError('Invalid OTP, please check and try again!')
            setLoading(false)
            return;
          }
          if (result.data.status === 6000 && result.data.data) {
            setTokens(result.data.data);
            setIsAuthenticated(true);
            setError(null);
            setUser(getName(result.data.data.access));
          } else {
            setError('Unknown error, please refresh and try again');
            setLoading(false);
            return;
          } 
        } else if (result.status === 401) {
          setIsAuthenticated(false);
          setError(result.data && result.data.message);
        }
        setLoading(false); 
      }
    ).catch(
      e => {
        console.log({verifyOTPError: e});
        setIsAuthenticated(false);
        setError('Unknown error, please refresh and try again');
        setLoading(false);
      }
    )
  }

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
        requestOTP,
        verifyOTP,
        getAccessToken,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}