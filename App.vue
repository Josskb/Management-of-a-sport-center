<template>
  <div id="app">
    <nav>
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/reservation" class="nav-link">Réserver</router-link>
      <router-link to="/compte" class="nav-link">Mon Compte</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  padding: 20px;
}

nav {
  display: flex;
  justify-content: center;
  background-color: #2C3E50;
  padding: 15px;
  margin-bottom: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  font-size: 18px;
  margin: 0 15px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #1ABC9C;
  border-radius: 5px;
}
</style>
