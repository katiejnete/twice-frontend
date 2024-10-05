import { useState, useEffect } from "react";

const useAuth = () => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? storedToken : null; 
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return [token, setToken];
};

export default useAuth;
