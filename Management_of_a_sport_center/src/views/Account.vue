<template>
  <div>
    <div class="compte">
      <h2>My Account</h2>
      <p>Passed Reservations:</p>
      <ul>
        <li v-for="(reservation, index) in reservations" :key="index" class="reservation-item">
          <span>{{ reservation.sport }} - {{ reservation.date }}</span>
          <button class="btn-cancel" @click="cancel(index)">Cancel</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserAccount',
  data() {
    return {
      reservations: []
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/my-reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.reservations = response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  },
  methods: {
    cancel(index) {
      this.reservations.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.compte {
  text-align: center;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  font-size: 2.5em;
  color: #34495E;
  margin-bottom: 30px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.reservation-item {
  background-color: #F5F5F5;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reservation-item span {
  font-size: 1.2em;
  color: #2C3E50;
}

.btn-cancel {
  background-color: #E74C3C;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: #C0392B;
}
</style>