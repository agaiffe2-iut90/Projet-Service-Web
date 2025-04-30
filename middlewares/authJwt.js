const jwt = require('jsonwebtoken');
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token?.startsWith('Bearer ')) {
    return res.status(403).send({
      message: "Aucun token fourni (via en-tête Authorization) !"
    });
  }

  token = token.slice(7, token.length);

  if (!token) {
    return res.status(403).send({
      message: "Aucun token fourni (après Bearer) !"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Token invalide ou expiré !"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken
};

module.exports = authJwt;