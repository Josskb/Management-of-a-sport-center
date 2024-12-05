<template>
  <div id="title_section">
    <h1 id="title">Sport Center Management</h1>
    <div id="user_log" v-if="!isLoggedIn">
      <router-link to="/signin"><button>Sign In</button></router-link>
      <router-link to="/login"><button>Log In</button></router-link>
    </div>
    <div v-else>
      <div id="account_LogIn">
        <p>Hello, {{ userName }}</p>
        <button @click="logOut">Log Out</button>
      </div>
    </div>
  </div>
  <header class="header">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/reservation">Reservation</router-link>
      <router-link to="/account">Account</router-link>
    </nav>
  </header>
</template>

<script>
import eventBus from '../eventBus';

export default {
  name: 'SportCenterHeader',
  data() {
    return {
      eventBus
    };
  },
  computed: {
    isLoggedIn() {
      return this.eventBus.isLoggedIn;
    },
    userName() {
      return this.eventBus.userName;
    }
  },
  methods: {
    logOut() {
      this.eventBus.isLoggedIn = false;
      this.eventBus.userName = '';
    }
  }
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

#account_LogIn{
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1dvh;
}

button {
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

nav {
  list-style-type: none;
  display: flex;
  justify-content: center;
  gap: 2rem;
  background-color: #767575;
  border-radius: 10px;
  text-decoration: none;
}

nav > * {
  border-radius: 10px;
  padding: 2px;
  text-decoration: none;
  color: white;
}

nav :hover {
  animation: shadow-drop-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
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