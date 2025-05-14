<template>
    <div class="auth-container">
      <div class="ponnyhappy-header">
        <img src="../../public/smile_poney.png" alt="Petit Poney" class="ponny-image">
        <h2>Bienvenue chez ponnyHappy !</h2>
        <img src="../../public/smile_poney.png" alt="Petit Poney" class="ponny-image flipped">
      </div>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="isSignUp" class="form-group">
          <input type="text" v-model="formData.firstName" placeholder="Prénom" required>
          <input type="text" v-model="formData.lastName" placeholder="Nom" required>
        </div>
        <div class="form-group">
          <input type="email" v-model="formData.emailId" placeholder="Email" required>
        </div>
        <div class="form-group password-input">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="formData.password"
            placeholder="Mot de passe (secret de poney)"
            required
          >
          <button type="button" class="password-toggle-button" @click="togglePasswordVisibility">
            <span v-if="passwordVisible">Afficher</span>
            <span v-else>Cacher</span>
          </button>
        </div>
        <button type="submit" class="submit-button">{{ isSignUp ? 'Rejoindre la galopade !' : 'En selle !' }}</button>
      </form>
      <p class="toggle-signup" @click="isSignUp = !isSignUp">
        {{ isSignUp ? 'Déjà un ami des poneys ? Se connecter' : 'Pas encore dans notre écurie ? S\'inscrire' }}
      </p>
      <p class="ponnyhappy-footer">Chez ponnyHappy, chaque jour est une aventure équestre !</p>
    </div>
  </template>
  
  <script>
 import axios from 'axios';

export default {
  data() {
  return {
    isSignUp: false,
    formData: {
      firstName: '',
      lastName: '',
      emailId: '',
      password: '',
    },
    passwordVisible: false,
    loading: false, 
  };
}
,
  methods: {
    async handleSubmit() {
    this.loading = true;
    this.errorMessage = '';

    const endpoint = this.isSignUp ? '/api/auth/signup' : '/api/auth/signin';

    try {
      const response = await axios.post(
        `http://localhost:3000${endpoint}`,
        this.formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        this.isSignUp = false;
        this.successMessage = 'Compte créé ! Veuillez vous connecter.';
        setTimeout(() => { this.successMessage = ''; }, 3000);
      } else if (response.status === 200) {
        this.$router.push('/home');
      } else {
        this.errorMessage = response.data.message || 'Erreur inconnue.';
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      } else if (error.response && error.response.data && error.response.data.message) {
        this.errorMessage = error.response.data.message;
      } else {
        this.errorMessage = 'Erreur de connexion au serveur.';
      }
    } finally {
      this.loading = false;
    }
  },


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
},
};
</script>
  
  <style scoped>
  .auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 20px;
    background-color: #f8f0e3;
  }
  
  .ponnyhappy-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .ponny-image {
    height: 50px;
    margin: 0 15px;
  }
  
  .ponny-image.flipped {
    transform: scaleX(-1);
  }
  
  h2 {
    margin-bottom: 20px;
    color: #7b3f00;
  }
  
  .auth-form {
    background-color: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
  }
  
  .form-group input {
    flex: 1;
  }
  
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    padding: 12px;
    border: 1px solid #c4a382;
    border-radius: 6px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .password-input {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .password-input input[type="password"],
  .password-input input[type="text"] {
    padding-right: 70px;
  }
  
  .password-toggle-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #777;
    font-size: 14px;
    outline: none;
  }
  
  .password-toggle-button:hover {
    color: #7b3f00;
  }
  
  .submit-button {
    background-color: #7b3f00; 
    color: white;
    padding: 14px 22px;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #5c2e00;
  }
  
  .toggle-signup {
    margin-top: 20px;
    color: #777;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .toggle-signup:hover {
    color: #7b3f00;
  }
  
  .ponnyhappy-footer {
    margin-top: 30px;
    color: #7b3f00;
    font-style: italic;
  }
  </style>