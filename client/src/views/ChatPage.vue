<template>
    <div class="chat-page">
      <div class="header">
        <h1 v-if="user">Bienvenue dans le chat, {{ user.displayName || 'utilisateur mystère' }} 🗨️</h1>
        <div v-else class="loading">
          Chargement...
        </div>
        <button v-if="user" @click="logoutUser" class="logout-button">Déconnexion</button>
      </div>
  
      <div v-if="user" class="content">
        <div class="chat-container">
          <div v-for="(message, index) in messages" :key="index" class="message">
            <strong class="sender">{{ message.senderName || message.senderId }}:</strong>
            <span class="text">{{ message.text }}</span>
          </div>
        </div>
        <div class="input-container">
          <input type="text" v-model="newMessage" @keyup.enter="sendMessage" class="message-input" placeholder="Votre message...">
          <button @click="sendMessage" class="send-button">Envoyer</button>
        </div>
      </div>
    </div>
  </template>

<script>
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';

export default {
  name: 'ChatPage',
  data() {
    return {
      user: null,
      loading: true,
      socket: null,
      newMessage: '',
      messages: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    const tokenFromHash = window.location.hash.substring(7);
    const authToken = localStorage.getItem('authToken');

    if (tokenFromHash) {
      try {
        const user = jwtDecode(tokenFromHash);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', tokenFromHash);
        next();
      } catch (error) {
        console.error("Erreur de décodage du token:", error);
        next('/');
      }
    } else if (authToken) {
      next();
    } else {
      next('/');
    }
  },
  mounted() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.loading = false;
      this.connectSocket();
    } else {
      this.$router.push('/');
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    connectSocket() {
      this.socket = io('http://localhost:5000');

      this.socket.on('connect', () => {
        console.log('Connecté au serveur Socket.IO');
      });

      this.socket.on('disconnect', () => {
        console.log('Déconnecté du serveur Socket.IO');
      });

      this.socket.on('chat message', (msg, senderId) => {
        this.messages.push({ text: msg, senderName: senderId });
      });
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        const user = JSON.parse(localStorage.getItem('user'));
        const messageData = {
          text: this.newMessage,
          senderName: user.displayName || 'utilisateur inconnu'
        };
        this.socket.emit('chat message', messageData);
        this.newMessage = '';
      }
    },
    logoutUser() {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      this.user = null;
      this.$router.push('/'); 
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    },
  },
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh; 
  padding: 20px;
  background-color: #f4f4f4;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.header h1 {
  color: #333;
  margin: 0;
}

.loading {
  color: #777;
}

.logout-button {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c82333;
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
}

.chat-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
}

.message {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 5px;
  background-color: #e9ecef;
  word-break: break-word; 
}

.message strong.sender {
  font-weight: bold;
  color: #007bff;
  margin-right: 5px;
}

.input-container {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #eee;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.send-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>