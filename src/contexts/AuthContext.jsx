import {createContext, useContext, useState, useEffect} from 'react'
/* eslint-disable react/prop-types */

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext) 

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState("") 
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [userInfo, setUserInfo] = useState({
    username: '',
    id: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        await newAccessToken();
      }
    };
    checkAuth();
  }, []);
  
  const newAccessToken = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.newAccessToken); 
        setUserInfo({
          username: data.user,
          id: data.id,
        });
        setIsAuthenticated(true);
        setIsLoading(false);

        return data.newAccessToken; 
      } 
    } catch (err) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
  };

  const authenticate = async (url, payload, isSignIn) => {
    try {
      const response = await fetch(`http://localhost:5000${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

        let data
        const contentType = response.headers.get('content-Type')

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        if (isSignIn) {
          setIsAuthenticated(true);
          setAccessToken(data.accessToken);
          setUserInfo({
            username: data.user,
            id: data.id,
          });
        }

  
        
        return { success: true, data};
      
    } catch (err) {
      
      setIsLoading(false);
      return {success: false}
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setAccessToken('');
        setUserInfo({ username: '', id: '' });
        
      } 
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, accessToken, userInfo, logout, newAccessToken }}>
     {isLoading ? <div>Loading</div> : children}
    </AuthContext.Provider>
  );

}






