const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models'); 


router.post('/signup', async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { emailId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstName, lastName, emailId, password: hashedPassword });

    return res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.post('/signin', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: 'Connexion réussie !', user: req.user });
});


router.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Déconnecté avec succès.' });
  });
});

router.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: `Bienvenue sur la page d'accueil !` });
  } else {
    res.status(401).json({ message: 'Accès non autorisé.' });
  }
});


module.exports = router;
