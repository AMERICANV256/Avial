import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    authUser();
  }, []);

  const authUser = () => {
    //sacar datos del usuario identificado en localstorage

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    //comprobar si tengo el token y el user

    if (!token || !user) {
      return false;
    }

    //transformar los datos a un objeto javascript

    const userObj = JSON.parse(user);

    setAuth(userObj);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
