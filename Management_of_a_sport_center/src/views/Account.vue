<template>
  <div>
    <div class="compte">
      <h2>My Account</h2>
      <p>Passed Reservations:</p>
      <ul>
        <li v-for="(reservation, index) in reservations" :key="index" class="reservation-item">
          <span>{{ reservation.sport }} - {{ reservation.date }}</span>
          <button class="btn-cancel" @click="confirmCancel(index)">Cancel</button>
        </li>
      </ul>
    </div>
    <div v-if="showConfirmDialog" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeConfirmDialog">&times;</span>
        <h2>Are you sure you want to cancel this reservation?</h2>
        <button class="btn-confirm" @click="closeConfirmDialog">No</button>
        <button class="btn-cancel" @click="cancelReservation">Yes</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserAccount',
  data() {
    return {
      reservations: [],
      showConfirmDialog: false,
      reservationToCancel: null
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
    confirmCancel(index) {
      this.reservationToCancel = index;
      this.showConfirmDialog = true;
    },
    closeConfirmDialog() {
      this.showConfirmDialog = false;
      this.reservationToCancel = null;
    },
    async cancelReservation() {
      try {
        const token = localStorage.getItem('token');
        const reservation = this.reservations[this.reservationToCancel];
        const response = await axios.post('http://localhost:3000/cancel-reservation', {
          sport: reservation.sport,
          date: reservation.date
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.reservations.splice(this.reservationToCancel, 1);
        this.closeConfirmDialog();
      } catch (error) {
        console.error('Error canceling reservation:', error);
      }
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

.btn-confirm {
  background-color: #95a59c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
  margin: 10px;
}

.btn-confirm:hover {
  background-color: #676e6a;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>