<template>
    <div class="homepage-container">
      <nav class="fixed-navbar">
        <div class="navbar-left">
          <img src="../../public/poney_club.png" alt="Logo du Royaume des Poneys" class="logo">
          <h1 class="navbar-title">ponnyHappy</h1>
        </div>
        <div class="navbar-right">
          <button @click="handleLogout" class="logout-button">Se déconnecter</button>
        </div>
      </nav>
  
      <main class="homepage-main">
        <section class="hero-section">
          <img src="../../public/sunglasses_poney.jpg" alt="Poneys Adorables" class="hero-image">
          <div class="hero-content">
            <h2>Découvrez le Monde Fascinant des Poneys</h2>
            <p>Des Shetlands miniatures aux robustes Fjords, explorez la diversité et le charme unique de ces équidés attachants. Apprenez-en davantage sur leurs races, leurs soins et leurs utilisations.</p>
            <a href="#en-savoir-plus" class="cta-button">En savoir plus</a>
          </div>
        </section>
  
        <section id="en-savoir-plus" class="featured-section">
          <h2>Nos Articles Phares</h2>
          <div class="featured-articles">
            <div class="article-card">
              <img src="../../public/shetland.jpg" alt="Poney Shetland">
              <h3>Le Poney Shetland : Petit par la taille, Grand par le cœur</h3>
              <p>Découvrez l'histoire, le tempérament et les caractéristiques uniques du plus petit des poneys britanniques.</p>
              <a href="#" class="read-more">Lire la suite</a>
            </div>
            <div class="article-card">
              <img src="../../public/viking_poney.jpg" alt="Poney Fjord">
              <h3>Le Poney Fjord : Un Héritage Viking</h3>
              <p>Apprenez-en davantage sur cette race ancienne de Norvège, reconnaissable à sa crinière bicolore distinctive.</p>
              <a href="#" class="read-more">Lire la suite</a>
            </div>
            <div class="article-card">
              <img src="../../public/costard_poney.jpg" alt="Poney Welsh">
              <h3>Les Poneys Welsh : Élégance et Polyvalence</h3>
              <p>Explorez les différentes sections du Welsh Pony, de l'élégant poney de selle au robuste cob.</p>
              <a href="#" class="read-more">Lire la suite</a>
            </div>
          </div>
        </section>
      </main>
  
      <footer class="homepage-footer">
        <p>&copy; 2025 Le Royaume des Poneys. Tous droits réservés.</p>
      </footer>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      content: 'Bienvenue, passionné de poneys !',
    };
  },
  created() {
    this.fetchSecureContent();
  },
  methods: {
    async fetchSecureContent() {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        this.$router.push('/auth');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/test/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.content = response.data.message || 'Bienvenue, passionné de poneys !';
      } catch (error) {
        console.error('Erreur lors de la récupération du contenu sécurisé:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          sessionStorage.removeItem('authToken');
          this.$router.push('/auth');
        }
      }
    },
    async handleLogout() {
      try {
        sessionStorage.removeItem('authToken');
        this.$router.push('/auth');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        this.$router.push('/auth');
      }
    },
  },
};
</script>
  
  <style scoped>
  .homepage-container {
    font-family: sans-serif;
    background-color: #f8f9fa;
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 50px; 
  }
  
  .fixed-navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #ffe0b2; 
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0caa6;
    z-index: 10;
  }
  
  .navbar-left {
    display: flex;
    align-items: center;
    height: 50px;
  }
  
  .logo {
    height: 100%;
    max-height: none; 
    margin-right: 15px;
  }
  
  .navbar-title {
    color: #a1887f;
    font-size: 20px;
    margin-left: 10px;
  }
  

  
  .logout-button {
    background-color: transparent; 
    color: red;
    border: solid 2px red; 
    padding: 10px 15px;
    margin-right: 40px;;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .logout-button:hover {
    background-color: #1c1fb7;
    color: white;
    border: none;
  }
  
  .homepage-header {
    background-color: transparent;
    padding: 40px 20px; 
    text-align: center;
    border-bottom: none; 
  }
  
  .homepage-header h1 {
    margin-bottom: 10px;
    color: #a1887f;

  }
  
  .homepage-header .tagline {
    color: #757575;
    font-style: italic;
  }
  
  .homepage-main {
    flex-grow: 1;
    padding: 20px;
  }
  
  .hero-section {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .hero-image {
    width: 50%;
    display: block;
    object-fit: cover;
    height: auto;
  }
  
  .hero-content {
    padding: 30px;
    width: 50%;
  }
  
  .hero-content h2 {
    color: #a1887f;
    margin-bottom: 15px;
  }
  
  .hero-content p {
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .cta-button {
    display: inline-block;
    background-color: #4caf50;
    color: white;
    padding: 12px 25px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .cta-button:hover {
    background-color: #388e3c;
  }
  
  .featured-section {
    padding: 30px;
    background-color: #f0f8f0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .featured-section h2 {
    color: #a1887f;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .featured-articles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .article-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .article-card img {
    width: 100%;
    display: block;
    height: auto;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    object-fit: cover;
    height: 200px;
  }
  
  .article-card h3 {
    padding: 15px;
    margin-bottom: 5px;
    color: #555;
  }
  
  .article-card p {
    padding: 0 15px 15px;
    line-height: 1.5;
    color: #777;
  }
  
  .read-more {
    display: inline-block;
    padding: 10px 15px;
    background-color: #a1887f;
    color: white;
    text-decoration: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    font-size: 14px;
    transition: background-color 0.3s ease;
  }
  
  .read-more:hover {
    background-color: #7b625b;
  }
  
  .homepage-footer {
    background-color: #e0caa6;
    padding: 15px;
    text-align: center;
    color: #555;
    border-top: 1px solid #d1bca4;
  }
  </style>