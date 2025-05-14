<template>
  <router-view />
</template>

<script>
import { getCurrentUser, logout } from './services/auth';

export default {
  data() {
    return {
      user: null,
      loading: true // Ajout d'un état de chargement initial
    };
  },
  // App.vue
async created() {
  this.loading = true;
  const token = localStorage.getItem('authToken');
  if (token) {
    this.user = await getCurrentUser();
  }
  this.loading = false;
},
  methods: {
    async handleLogout() {
      await logout();
      this.user = null;
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Tu peux ajouter des styles globaux ici si nécessaire */
</style>