const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const discordStrategy = require('passport-discord').Strategy;
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
    console.log('Sérialisation de l\'utilisateur :', user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Désérialisation de l\'utilisateur avec l\'ID :', id);
    User.findById(id).then(user => {
        console.log('Utilisateur désérialisé :', user);
        done(null, user);
    }).catch(err => {
        console.error('Erreur lors de la désérialisation :', err);
        done(err, null);
    });
});

passport.use(
    new GoogleStrategy({
        callbackURL: 'http://localhost:5000/auth/google/callback',
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        scope: ['profile', 'email'], // Assure-toi que ce paramètre est bien là
        proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
          const existingGoogleUser = await User.findOne({ googleId: profile.id });
          const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
      
          if (existingGoogleUser) {
            return done(null, existingGoogleUser);
          }
      
          if (existingEmailUser) {
            existingEmailUser.googleId = profile.id;
            await existingEmailUser.save();
            return done(null, existingEmailUser);
          }
      
          const newUser = await new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          }).save();
          done(null, newUser);
      
        } catch (error) {
          done(error, null);
        }
      })
);

passport.use(new discordStrategy({
    clientID: keys.discordClientId,
    clientSecret: keys.discordClientSecret,
    callbackURL: 'http://localhost:5000/auth/discord/callback',
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Profile Discord (brut):', profile);
    try {
      const existingDiscordUser = await User.findOne({ discordId: profile.id });
      const existingEmailUser = await User.findOne({ email: profile.email });
  
      if (existingDiscordUser) {
        return done(null, existingDiscordUser);
      }
  
      if (existingEmailUser) {
        existingEmailUser.discordId = profile.id;
        await existingEmailUser.save();
        return done(null, existingEmailUser);
      }
  
      const newUser = new User({
        discordId: profile.id,
        displayName: profile.username,
        email: profile.email,
      });
      await newUser.save();
      done(null, newUser);
  
    } catch (err) {
      console.error('Erreur lors de l\'authentification Discord:', err);
      done(err, null);
    }
  }));


module.exports = passport;