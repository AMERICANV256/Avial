// hooks/useTokenValidation.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useTokenValidation = (token) => {
  const navigate = useNavigate();

  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    if (token && checkTokenExpiration(token)) {
      navigate("/");
    }
  }, [token, navigate]);
};

export default useTokenValidation;
