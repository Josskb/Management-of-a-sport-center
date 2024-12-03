<template>
  <div id="title_section">
    <h1 id="title">Sport Center Management</h1>
    <div id="user_log" v-if="!isLoggedIn">
      <button @click="signIn">Sign In</button>
      <button @click="logIn">Log In</button>
    </div>
    <div v-else>
      <p>Hello, {{ userName }}</p>
    </div>
  </div>
  <header class="header">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li> 
        <li><router-link to="/about">About Us</router-link></li> 
        <li><router-link to="/contact">Contact</router-link></li> 
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'SportCenterHeader'
}
</script>

<style scoped>
#title_section {
  background-color: #333;
  color: white;
  display: flex;
  flex-direction: row;
  
}

#user_log {
  margin-left: auto;
  gap: 1rem;
  display: flex;
  align-items: center;
  background-color: #393838;
  padding: 1vh;
  margin-right: 1rem;
  border-radius: 10px;
  width: auto;
  margin: 1vh;
}

#user_log button {
  background-color: #595959;
  color: white;
  border: none;
  padding: 1vh;
  border-radius: 10px;
  
}

#user_log button:hover {
  animation: shadow-drop-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

#title {
  text-align: center;
  color: white;
  padding: 1vh;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto;
}

.header {
  background-color: #595959;
  padding: 1rem;
  color: white;
}

nav ul {
  list-style-type: none;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: white;
  font-weight: bold;
}

@keyframes shadow-drop-center {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
  }
}
</style>
