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
        '/auth/github',
        passport.authenticate('github', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/github/callback',
        passport.authenticate('github', {
          failureRedirect: '/',
        }),
        (req, res) => {
          if (!req.user) {
            return res.redirect('/');
          }
          res.redirect('/chat');
        }
      );

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

    app.post('/auth/local', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                return res.status(401).send({ message: info.message }); 
            }
            req.logIn(user, err => {
                if (err) { return next(err); }
                const payload = {
                    id: user._id,
                    displayName: user.displayName,
                    email: user.email
                };
                const token = jwt.sign(payload, 'VOTRE_SECRET_KEY', { expiresIn: '1h' });
                return res.send({ token }); 
            });
        })(req, res, next);
    });

    app.post('/auth/register', async (req, res) => {
        const { email, password, displayName } = req.body;

        if (!email || !password || !displayName) {
            return res.status(400).send({ message: 'Tous les champs sont requis.' });
        }

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).send({ message: 'Cet email est déjà utilisé.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                password: hashedPassword,
                displayName,
                localAuth: true 
            });

            await newUser.save();

            req.logIn(newUser, err => {
                if (err) { return next(err); }
                const payload = {
                    id: newUser._id,
                    displayName: newUser.displayName,
                    email: newUser.email
                };
                const token = jwt.sign(payload, 'VOTRE_SECRET_KEY', { expiresIn: '1h' });
                return res.status(201).send({ token }); 
            });

        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            return res.status(500).send({ message: 'Erreur lors de la création du compte.' });
        }
    });

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