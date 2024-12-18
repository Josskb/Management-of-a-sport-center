<template>
  <div class="reservation-page">
    <div class="reservation">
      <h2>Reserve Equipment or a Field</h2>
      <div class="sports-sections">
        <div v-for="section in sportsSections" :key="section.id" class="section-card">
          <h3>{{ section.name }}</h3>
          <img :src="section.imageUrl" alt="Sport Image" class="sport-image" v-if="section.imageUrl">
          <button class="btn-view" @click="openSection(section)">View Options</button>
        </div>
      </div>
    </div>

    <div v-if="selectedSection" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeSectionModal">&times;</span>
        <h2>{{ selectedSection.name }}</h2>
        <div v-if="selectedSection.fields.length">
          <h3>Fields</h3>
          <ul>
            <li v-for="field in selectedSection.fields" :key="field.id">
              <span>{{ field.name }} - {{ field.price }}€</span>
              <img :src="field.imageUrl" alt="Field Image" class="field-image" v-if="field.imageUrl">
              <button class="btn-reserve" @click="openReservationModal(field, 'field')">Reserve</button>
            </li>
          </ul>
        </div>
        <div v-if="selectedSection.equipment.length">
          <h3>Equipment</h3>
          <ul>
            <li v-for="item in selectedSection.equipment" :key="item.id">
              <span>{{ item.name }} - {{ item.price }}€</span>
              <img :src="item.imageUrl" alt="Equipment Image" class="equipment-image" v-if="item.imageUrl">
              <button class="btn-reserve" @click="openReservationModal(item, 'equipment')">Reserve</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="selectedItem" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeReservationModal">&times;</span>
        <h2>Reserve {{ selectedItem.name }}</h2>
        <label for="date">Select Date:</label>
        <input type="date" id="date" v-model="selectedDate" />
        <button class="btn-reserve" @click="reserve">Confirm Reservation</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>

    <div v-if="showAuthPrompt && !isLoggedIn" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAuthPrompt = false">&times;</span>
        <h2>Join Us Today!</h2>
        <p>Sign in or log in to start making reservations and enjoy our facilities.</p>
        <router-link to="/signin"><button class="btn-secondary">Sign In</button></router-link>
        <router-link to="/login"><button class="btn-secondary">Log In</button></router-link>
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
      sportsSections: [],
      selectedSection: null,
      selectedItem: null,
      selectedDate: '',
      errorMessage: '',
      showAuthPrompt: false
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/reservations/sports');
      this.sportsSections = response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  },
  computed: {
    isLoggedIn() {
      return eventBus.isLoggedIn;
    }
  },
  methods: {
    openSection(section) {
      this.selectedSection = section;
    },
    closeSectionModal() {
      this.selectedSection = null;
    },
    openReservationModal(item, type) {
      if (!this.isLoggedIn) {
        this.showAuthPrompt = true;
        return;
      }
      this.selectedItem = { ...item, type };
    },
    closeReservationModal() {
      this.selectedItem = null;
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

        // Check if no date is selected
        if (!this.selectedDate) {
          this.errorMessage = 'You have to choose a date';
          return;
        }

        // Check if the date is before today
        const today = new Date().toISOString().split('T')[0];
        if (this.selectedDate < today) {
          this.errorMessage = 'Cannot reserve a date before today';
          return;
        }

        const response = await axios.post('http://localhost:3000/reservations/reservations', { // Correct endpoint
          type: this.selectedItem.type,
          item_id: this.selectedItem.id,
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
.reservation-page {
  background: url('https://example.com/background.jpg') no-repeat center center fixed;
  background-size: cover;
  justify-content: center;
  align-items: center;
}

.reservation {
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 1000px;
  max-height: 60vh;
  margin: 20px auto; /* Add margin to avoid overlapping */
  padding-bottom: 5vh;
}

h2 {
  font-size: 2.5em;
  color: #34495E;
  margin-bottom: 20px;
}

.sports-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  max-height: 50vh; /* Set a maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
}

.section-card {
  background-color: #ECF0F1;
  padding: 20px;
  border-radius: 8px;
  width: 200px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.sport-image, .field-image, .equipment-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin: 10px 0;
}

h3, h4 {
  font-size: 1.8em;
  color: #2C3E50;
}

p {
  font-size: 1.2em;
  color: #7F8C8D;
}

.btn-reserve, .btn-view {
  background-color: #E74C3C;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-reserve:hover, .btn-view:hover {
  background-color: #C0392B;
  transform: scale(1.05);
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
  max-width: 500px;
  width: 100%;
  max-height: 75vh;
  overflow-y: auto;
  margin-bottom: 15vh; 
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

span {
  font-size: 1.2em;
  color: #2C3E50;
  padding: 10px;
}

li {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
}

ul {
  list-style-type: none;
  padding: 0;
}

input#date {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

label {
  display: block;
  font-size: 1.2em;
  color: #2C3E50;
  margin-bottom: 5px;
}


@media (max-width: 768px) {
  .reservation {
    margin: 10px auto; 
    padding: 20px; 
  }

  .section-card {
    width: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-content {
    max-width: 90%;
  }
}

.btn-secondary {
  background-color: #2ecc71;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 10px;
}

.btn-secondary:hover {
  background-color: #27ae60;
  transform: scale(1.05);
}
</style>