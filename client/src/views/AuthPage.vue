<template>
  <div class="auth-container">
    <h1>Bienvenue !</h1>
    <p class="subtitle">Connecte-toi ou inscris-toi pour entrer dans le Chat (Baptiste DULIEUX, Anna GAIFFE) 🔥</p>

    <div class="social-login">
      <h2>Se connecter via</h2>
      <div class="social-buttons">
        <a class="google-btn" href="http://localhost:5000/auth/google">
          <img src="@/assets/google_logo.svg" alt="Google" class="social-icon">
          Continuer avec Google
        </a>
        <a class="discord-btn" href="http://localhost:5000/auth/discord">
          <img src="@/assets/discord_logo.svg" alt="Discord" class="social-icon">
          Continuer avec Discord
        </a>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AuthPage',
    data() {
      return {
        loginError: '',
        registerError: ''
      };
    },
    methods: {
      async loginLocal() {
        try {
          const response = await axios.post('http://localhost:5000/auth/local', this.localLogin);
          localStorage.setItem('authToken', response.data.token);
          console.log('server response:', response.data);
          console.log('redirecting to chat...');
          this.$router.push('/chat');
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            this.loginError = error.response.data.message;
          } else {
            this.loginError = 'Erreur de connexion. Veuillez réessayer.';
          }
          console.error('Erreur de connexion locale:', error);
        }
      },
      async registerLocal() {
        try {
          const response = await axios.post('http://localhost:5000/auth/register', this.localRegister);
          localStorage.setItem('authToken', response.data.token);
          this.$router.push('/chat');
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            this.registerError = error.response.data.message;
          } else {
            this.registerError = 'Erreur d\'inscription. Veuillez réessayer.';
          }
          console.error('Erreur d\'inscription locale:', error);
        }
      }
    }
  };
  </script>
  
  
  <style scoped>
  .auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 50px auto;
  }
  
  h1 {
    color: #333;
    margin-bottom: 10px;
  }
  
  .subtitle {
    color: #777;
    margin-bottom: 30px;
  }
  
  .social-login {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .social-login h2 {
    color: #555;
    margin-bottom: 15px;
  }
  
  .social-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  
  .google-btn, .github-btn, .discord-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    color: white;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease-in-out;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .google-btn {
    background-color: #db4437;
  }
  
  .github-btn {
    background-color: #333;
  }
  
  .discord-btn {
    background-color: #7289da;
  }
  
  .social-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  
  .google-btn:hover, .github-btn:hover, .discord-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .separator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
    color: #bbb;
  }
  
  .separator::before,
  .separator::after {
    content: '';
    flex-grow: 1;
    background-color: #ddd;
    height: 1px;
    margin: 0 15px;
  }
  
  .local-auth-container {
    display: flex;
    gap: 30px;
    width: 100%;
    max-width: 500px;
  }
  
  .local-login, .local-register {
    flex: 1;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    text-align: left;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .local-auth-container h2 {
    color: #555;
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  
  input[type='email'],
  input[type='password'],
  input[type='text'] {
    width: calc(100% - 22px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    color: #333;
  }
  
  .local-btn, .register-btn {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    color: white;
    background-color: #007bff;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease-in-out;
    margin-top: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .register-btn {
    background-color: #28a745;
  }
  
  .local-btn:hover, .register-btn:hover {
    background-color: #0056b3;
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .error-message {
    color: #dc3545;
    margin-top: 10px;
    text-align: center;
  }
  </style>