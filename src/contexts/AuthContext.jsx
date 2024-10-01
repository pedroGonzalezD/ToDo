import {createContext, useContext, useState, useEffect} from 'react'
/* eslint-disable react/prop-types */

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext) 

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState("") 
  const [isLoading, setIsLoading] = useState(true)
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
        credentials: "include", // Para incluir el refresh token
      });
      
        console.log("hola")
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.newAccessToken); // Actualizar el token en el estado
        setUserInfo({
          username: data.user,
          id: data.id,
        });
        setIsAuthenticated(true);
        setIsLoading(false);
        console.log("renovado")

        return data.newAccessToken; // Retorna el nuevo access token
      } else {
        console.error("Error en la renovación del token:", response.statusText);
        setIsAuthenticated(false);
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      console.error("Error en la solicitud de renovación del token:", error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return null;
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

        console.log(response)
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

        console.log('Success:', data.accessToken, data);
        console.log(data.accessToken)
        
        return { success: true, data};
      
    } catch (err) {
      console.error('Error', err);
      setIsLoading(false);
      return {success: false}
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include', // Para eliminar la cookie del refresh token
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setAccessToken('');
        setUserInfo({ username: '', id: '' });
        console.log('Logout successful');
      } else {
        console.error('Failed to logout');
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






