const jwt = require("jwt-simple");
const moment = require("moment");

//IMPORTAR CLAVE SECRETA

const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//MIDDLEWARE DE AUTENTICACION

exports.auth = (req, res, next) => {
  // comprobar si me llega la cabecera de auth

  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "La peticion no tiene la cabecera de Autenticación",
    });
  }

  //Limpiar el token
  let token = req.headers.authorization.replace(/['"]+/g, "");

  //Decodificar el token

  try {
    let payload = jwt.decode(token, secret);
    //Comprobar expiracion del token
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "token expirado",
      });
    }

    //Agregar datos de usuario a request

    req.user = payload;
  } catch (error) {
    return res.status(401).send({
      status: "error",
      message: "token inválido",
      error,
    });
  }

  //Pasar a ejecucion de accion

  next();
};
