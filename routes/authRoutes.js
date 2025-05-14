const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

module.exports = app => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/'
    }), (req, res) => {
        const payload = {
            id: req.user._id, 
            displayName: req.user.displayName,
            email: req.user.email

        };
        const token = jwt.sign(payload, 'VOTRE_SECRET_KEY', { expiresIn: '1h' });
        res.redirect(`http://localhost:3000/chat#token=${token}`);
    });


    app.get(
        '/auth/discord',
        passport.authenticate('discord', {
            scope: ['identify','email']
        })
    );

    app.get('/auth/discord/callback',
        passport.authenticate('discord', { failureRedirect: '/' }),
        (req, res) => {
            if (!req.user) {
                return res.redirect('/');
            }


            const payload = {
                id: req.user._id, 
                displayName: req.user.displayName,
                email: req.user.email 
            };

            
            const token = jwt.sign(payload, 'VOTRE_SECRET_KEY', { expiresIn: '1h' });

          
            res.redirect(`http://localhost:3000/chat#token=${token}`);
        }
    );


    app.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('http://localhost:3000/chat');
    });

    app.get('/api/current_user', (req, res) => {
        if (!req.user) {
          return res.status(401).send({ message: 'Non authentifié' });
        }
        res.send(req.user); 
      });
}