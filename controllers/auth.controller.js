const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
    console.log(req.body);
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user =>{
            res.send({message: "l'utilisateur a été créé avec succès!"});
        })

        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.signin = (req, res) => {
  console.log(req.body);
  User.findOne({
      where: {
          emailId: req.body.emailId
      }
  })
      .then(User => {
          if (!User) {
              return res.status(404).send({ message: "utilisateur non trouvé" });
          }
          let passwordIsValid = bcrypt.compareSync(
              req.body.password,
              User.password
          );
          if (!passwordIsValid) {
              return res.status(401).send({
                  message: "Mot de passe invalide !"
              });
          };
          let token = jwt.sign({ id: User.id }, config.secret, {
              expiresIn: 86400
          });
          res.status(200).send({
              id: User.id,
              username: User.emailId,
              message: "Connexion réussie !",
              token: token
          });
      })
      .catch(err => {
          res.status(500).send({ message: err.message });
      });
};

  exports.signout = (req, res) =>  {
    res.clearCookie('authToken', {path: '/'});
    res.status(200).send({message: "Déconnexion réussie !"});
  }