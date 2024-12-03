<template>
    <div class="home">
      <h1>Bienvenue sur notre site de location d'équipement sportif</h1>
      <p>Réservez vos équipements et terrains pour vos entraînements.</p>
      <div class="links">
        <router-link to="/reservation" class="btn-main">Réserver des équipements et terrains</router-link>
        <router-link to="/compte" class="btn-main">Voir mon compte</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  }
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    background-color: #fff;
    border-radius: 8px;
    padding: 50px 30px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 2.5em;
    color: #34495E;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.2em;
    color: #7F8C8D;
    margin-bottom: 30px;
  }
  
  .links {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .btn-main {
    background-color: #3498DB;
    color: white;
    text-decoration: none;
    padding: 15px 30px;
    font-size: 1.2em;
    border-radius: 30px;
    transition: background-color 0.3s;
  }
  
  .btn-main:hover {
    background-color: #2980B9;
  }
  </style>
  