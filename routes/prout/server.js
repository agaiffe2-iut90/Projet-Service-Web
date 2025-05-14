const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');
require('dotenv').config();


const app = express();
require('./passport/passport.config')(passport);

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new SequelizeStore({db: db.sequelize}),
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

db.sequelize.sync({ force: true }).then(() => {
    console.log("🚀 Tables recréées !");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
});