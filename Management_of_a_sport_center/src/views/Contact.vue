<template>
    <div>
      <div class="contact">
        <h2>Contact Us</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="form.name" placeholder="Enter your name" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="form.email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" v-model="form.message" placeholder="Enter your message" required></textarea>
          </div>
          <button type="submit" class="btn-submit">Send</button>
        </form>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </div>
    </div>
</template>

<script>
import eventBus from '../eventBus';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Contact',
  components: {
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      successMessage: ''
    };
  },
  created() {
    // Automatically fill in the form if the user is connected
    if (eventBus.isLoggedIn) {
      this.form.name = eventBus.userName;
      this.form.email = eventBus.email;
    }
  },
  methods: {
    submitForm() {
      this.successMessage = `Thank you for your message, ${this.form.name}!`;
      this.form.name = '';
      this.form.email = '';
      this.form.message = '';
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }
  }
}
</script>

<style scoped>
.contact {
  text-align: center;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
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

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

textarea {
  resize: vertical;
  height: 100px;
}

.btn-submit {
  background-color: #E74C3C;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-submit:hover {
  background-color: #C0392B;
  transform: scale(1.05);
}

.success-message {
  margin-top: 20px;
  color: #27AE60;
  font-size: 1.2em;
}
</style>