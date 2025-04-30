const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { or } = require('sequelize');
require('dotenv').config();

const app = express();
let corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
    secure: false
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({message: "hello world"})
})

const PORT = process.env.PORT || 3000;

const db = require('./models');
db.sequelize.sync().then(() => {
    console.log('db syncro');
});

//routes
require('./routes/auth.route')(app);
require('./routes/user.route')(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});