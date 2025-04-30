const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const pool = require('../database/db');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO users (first_name, last_name, email_id, password) VALUES ($1, $2, $3, $4)',
        [firstName, lastName, emailId, hashedPassword]
      );
      res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    if (error.code === '23505' && error.constraint === 'users_email_id_key') {
      return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
    }
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
});

router.post('/signin', passport.authenticate('local', (err, user, info) => {
  if (err) {
    console.error('Erreur lors de l\'authentification:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
  }
  if (!user) {
    return res.status(401).json({ message: info?.message || 'Nom d\'utilisateur ou mot de passe incorrect.' });
  }
  req.logIn(user, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la session:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la création de la session.' });
    }
    return res.status(200).json({ message: 'Authentification réussie.' });
  });
}));

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: 'Déconnexion réussie.' });
  });
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.json({ message: `Bienvenue, ${req.user.username} !` });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
}

module.exports = router;