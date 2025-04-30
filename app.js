const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const app = express();
const port = 3000;

require('./passport/passport-config')(passport);

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true, // Autorise l'envoi de cookies de session
};

app.use(cors(corsOptions)); 


const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 

app.use(cookieParser()); 

app.use(session({
  secret: 'Shaco25', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, 
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoutes);


app.get('/home', isAuthenticated, (req, res) => {
  res.send('Bienvenue sur la page d\'accueil ! Vous êtes authentifié.');
});


app.get('/test/user', isAuthenticated, (req, res) => {
  res.json({ message: `Bonjour ${req.user.first_name} ${req.user.last_name} !` });
});

app.get('/', (req, res) => {
  res.send('Bienvenue sur ponnyHappy ! Veuillez vous connecter ou vous inscrire via /auth/signin ou /auth/signup.');
});


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Non autorisé'); 
}

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});