<template>
  <div>
    <div class="reservation">
      <h2>Reserve Equipment or a Field</h2>
      <div v-for="sport in sports" :key="sport.name" class="sport-card">
        <h3>{{ sport.name }}</h3>
        <p>Price: {{ sport.price }}€</p>
        <button class="btn-reserve" @click="openReservationModal(sport)">Reserve</button>
      </div>
    </div>

    <div v-if="selectedSport" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeReservationModal">&times;</span>
        <h2>Reserve {{ selectedSport.name }}</h2>
        <label for="date">Select Date:</label>
        <input type="date" id="date" v-model="selectedDate" />
        <button class="btn-reserve" @click="reserve">Confirm Reservation</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import eventBus from '../eventBus';

export default {
  name: 'UserReservation',
  data() {
    return {
      sports: [
        { name: 'Football', price: 10 },
        { name: 'Basketball', price: 12 },
        { name: 'Tennis', price: 8 },
        { name: 'Badminton', price: 6 }
      ],
      selectedSport: null,
      selectedDate: '',
      errorMessage: ''
    };
  },
  methods: {
    openReservationModal(sport) {
      if (!eventBus.isLoggedIn) {
        alert('You must be logged in to make a reservation.');
        return;
      }
      this.selectedSport = sport;
    },
    closeReservationModal() {
      this.selectedSport = null;
      this.selectedDate = '';
      this.errorMessage = '';
    },
    async reserve() {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debug log to verify the token
        if (!token) {
          this.errorMessage = 'No token found. Please log in again.';
          return;
        }

        const response = await axios.post('http://localhost:3000/reservations', {
          sport: this.selectedSport.name,
          date: this.selectedDate
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.closeReservationModal();
        this.$router.push('/account'); // Redirect to account page to refresh reservations
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    }
  }
}
</script>

<style scoped>
.reservation {
  text-align: center;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  font-size: 2em;
  color: #34495E;
  margin-bottom: 20px;
}

.sport-card {
  background-color: #ECF0F1;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  transition: transform 0.3s ease-in-out;
}

.sport-card:hover {
  transform: translateY(-10px);
}

h3 {
  font-size: 1.8em;
  color: #2C3E50;
}

p {
  font-size: 1.2em;
  color: #7F8C8D;
}

.btn-reserve {
  background-color: #E74C3C;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-reserve:hover {
  background-color: #C0392B;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5em;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>