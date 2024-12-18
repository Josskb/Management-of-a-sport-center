<template>
  <div class="auth">
    <h2>Log In</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit" class="btn-submit">Log In</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import eventBus from '../eventBus';

export default {
  name: 'LogIn',
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', this.form); // Ensure the correct endpoint
        alert(response.data.message);

        // Store the token and admin status in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('userName', response.data.username);
        localStorage.setItem('userEmail', response.data.email); // Store email
        localStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin));

        console.log(response.data.isAdmin);
        console.log('Token stored:', localStorage.getItem('token')); // Debug log to verify the token

        // Emit the logIn event
        eventBus.isLoggedIn = true;
        eventBus.userName = response.data.username;
        eventBus.email = response.data.email; // Emit email
        eventBus.isAdmin = response.data.isAdmin;

        // Redirect to account page
        this.$router.push('/account');

        // Reset form
        this.form.email = '';
        this.form.password = '';
      } catch (error) {
        console.error('Error logging in:', error); // Debug log to verify error
        alert(error.response.data.message);
      }
    }
  }
}
</script>

<style scoped>
.auth {
  text-align: center;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 600px;
  margin: 1vh auto;
  padding-right: 45px;
}

h2 {
  font-size: 2em;
  color: #34495E;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-size: 1.2em;
  color: #2C3E50;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.btn-submit {
  background-color: #E74C3C;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #C0392B;
}
</style>