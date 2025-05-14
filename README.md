
*Baptiste DULIEUX & Anna GAIFFE - S4B1*

[Voir la démo](./video/video_mini_projet3.mp4)
______________________________________________________
# Projet 3

## Exécution projet 3:
```
$ node index.js
```
*(nouveau terminal)*
```
$ cd client
```
```
$ npm run serve
```
______________________________________________________

## Mini-projet 3 : Authentification OAuth2 avec Google et Chat en temps réel

Ce troisième mini-projet implémente une authentification OAuth2 via Google et ajoute un système de messagerie instantanée en temps réel entre utilisateurs connectés.
Technologies utilisées :

    Backend : Node.js avec Express.js et Passport.js (Google Strategy)
    Frontend : Vue.js
    Base de données : MongoDB avec Mongoose
    Mise en cache : Redis
    Websockets : Socket.io

Fonctionnalités :

    Authentification OAuth2 via Google + un autre
    Stockage des utilisateurs et tokens dans MongoDB
    Mise en cache des sessions avec Redis
    Interface de chat entre utilisateurs connectés
    Stockage de l’historique des messages dans MongoDB

Objectifs pédagogiques :

    Comprendre les différentes méthodes d’authentification
    Maîtriser la gestion des sessions via cookies et JWT
    Implémenter une authentification OAuth2 avec un fournisseur tiers
    Mettre en place un système de chat en temps réel
    Optimiser la gestion des sessions avec Redis
