const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'emailId',
    passwordField: 'password'
  },
  async (emailId, password, done) => {
    try {
      const user = await User.findOne({ where: { emailId } });
      if (!user) return done(null, false, { message: 'Utilisateur non trouvé.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Mot de passe incorrect.' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
