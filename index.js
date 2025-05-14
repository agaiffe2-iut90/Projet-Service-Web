const express = require('express');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const redis = require('ioredis');
require('./models/User');

const redisClient = new redis({
    host: 'localhost',
    port: 6379,
});

redisClient.on('connect', () => {
    console.log('Connecté à Redis');
});



redisClient.on('error', (err) => {
    console.error('Erreur de connexion à Redis:', err);
});

const passport = require('passport');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));

const app = express();
const server = http.createServer(app); // Créer le serveur HTTP
const io = socketio(server, {
    cors: {
        origins: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    }
});

// Configuration de cors
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session({
    secret: keys.cookieKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

app.get('/', (req, res) => {
    res.send("Hello World");
});


const MAX_MESSAGES = 100; // Nombre maximum de messages à conserver dans Redis
const MESSAGE_KEY = 'chat_messages'; // Clé Redis pour stocker les messages

io.on('connection', async (socket) => {
    console.log("Nouvel utilisateur connecté:", socket.id);

    // Envoyer les messages récents depuis Redis au nouvel utilisateur
    try {
        const recentMessages = await redisClient.lrange(MESSAGE_KEY, 0, -1);
        recentMessages.reverse().forEach(message => {
            const parsedMessage = JSON.parse(message);
            socket.emit('chat message', parsedMessage.text, parsedMessage.senderName);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages depuis Redis:', error);
    }

    socket.on('disconnect', () => {
        console.log("Utilisateur déconnecté:", socket.id);
    });

    socket.on('chat message', async (messageData) => {
        console.log("Message reçu:", messageData);
        io.emit('chat message', messageData.text, messageData.senderName);

        // Ajouter le nouveau message à Redis
        const messageToStore = JSON.stringify(messageData);
        try {
            await redisClient.lpush(MESSAGE_KEY, messageToStore);
            await redisClient.ltrim(MESSAGE_KEY, 0, MAX_MESSAGES - 1); // Limiter la taille de la liste
        } catch (error) {
            console.error('Erreur lors de l\'ajout du message à Redis:', error);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Faire écouter le serveur HTTP
    console.log(`Server is running on port ${PORT}`);
});