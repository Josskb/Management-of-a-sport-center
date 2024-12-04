<template>
    <div>

      <div class="contact">
        <h2>Contact Us</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="form.email" required />
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" v-model="form.message" required></textarea>
          </div>
          <button type="submit" class="btn-submit">Envoyer</button>
        </form>
      </div>
    </div>
  </template>

  <script>
  export default {
    name: 'Contact',
    components: {
    },
    data() {
      return {
        form: {
          name: '',
          email: '',
          message: ''
        }
      };
    },
    methods: {
      submitForm() {
        alert(`Merci pour votre message, ${this.form.name}!`);
        this.form.name = '';
        this.form.email = '';
        this.form.message = '';
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
    transition: background-color 0.3s;
  }
  
  .btn-submit:hover {
    background-color: #C0392B;
  }
  </style>