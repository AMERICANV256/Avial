import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();

    setAuth({});

    navigate("/");
  }, []);

  return <div>Cerrando sesión</div>;
}
