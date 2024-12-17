<template>
  <div class="account-page">
    <div class="compte">
      <h2>My Account</h2>
      <p>Basket:</p>
      <ul>
        <li v-for="(reservation, index) in basket" :key="index" class="reservation-item">
          <div class="reservation-details">
            <img :src="reservation.imageUrl" alt="Reservation Image" class="reservation-image" v-if="reservation.imageUrl">
            <div class="reservation-info">
              <h3>{{ reservation.name }}</h3>
              <p>{{ reservation.type === 'equipment' ? 'Equipment' : 'Field' }}</p>
              <p>{{ reservation.date }}</p>
              <p>{{ reservation.price }}€</p>
            </div>
          </div>
          <button class="btn-cancel" @click="removeFromBasket(index)">Remove</button>
        </li>
      </ul>
      <p>Total Price: {{ totalPrice }}€</p>
      <button class="btn-pay" @click="openPaymentModal">Pay</button>
      <p>Passed Reservations:</p>
      <ul>
        <li v-for="(reservation, index) in reservations" :key="index" class="reservation-item">
          <div class="reservation-details">
            <img :src="reservation.imageUrl" alt="Reservation Image" class="reservation-image" v-if="reservation.imageUrl">
            <div class="reservation-info">
              <h3>{{ reservation.name }}</h3>
              <p>{{ reservation.type === 'equipment' ? 'Equipment' : 'Field' }}</p>
              <p>{{ reservation.date }}</p>
            </div>
          </div>
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
    <div v-if="showPaymentModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closePaymentModal">&times;</span>
        <h2>Confirm Payment</h2>
        <p>Total Price: {{ totalPrice }}€</p>
        <label for="paymentMethod">Payment Method:</label>
        <select id="paymentMethod" v-model="paymentMethod">
          <option value="card">Card</option>
          <option value="cash">Cash</option>
        </select>
        <button class="btn-confirm" @click="confirmPayment">Confirm Payment</button>
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
      basket: [],
      showConfirmDialog: false,
      showPaymentModal: false,
      reservationToCancel: null,
      paymentMethod: 'card'
    };
  },
  computed: {
    totalPrice() {
      return this.basket.reduce((total, reservation) => total + parseFloat(reservation.price), 0);
    }
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/my-reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.reservations = response.data.filter(reservation => reservation.confirmed).map(reservation => ({
        ...reservation,
        name: reservation.type === 'equipment' ? reservation.Equipment.name : reservation.Field.name,
        imageUrl: reservation.type === 'equipment' ? reservation.Equipment.imageUrl : reservation.Field.imageUrl,
        price: parseFloat(reservation.type === 'equipment' ? reservation.Equipment.price : reservation.Field.price)
      }));
      this.basket = response.data.filter(reservation => !reservation.confirmed).map(reservation => ({
        ...reservation,
        name: reservation.type === 'equipment' ? reservation.Equipment.name : reservation.Field.name,
        imageUrl: reservation.type === 'equipment' ? reservation.Equipment.imageUrl : reservation.Field.imageUrl,
        price: parseFloat(reservation.type === 'equipment' ? reservation.Equipment.price : reservation.Field.price)
      }));
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
          type: reservation.type,
          item_id: reservation.item_id,
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
    },
    openPaymentModal() {
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
    },
    async confirmPayment() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/confirm-payment', {
          paymentMethod: this.paymentMethod
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.reservations.push(...this.basket);
        this.basket = [];
        this.closePaymentModal();
      } catch (error) {
        console.error('Error confirming payment:', error);
      }
    },
    async removeFromBasket(index) {
      try {
        const token = localStorage.getItem('token');
        const reservation = this.basket[index];
        await axios.post('http://localhost:3000/remove-from-basket', {
          type: reservation.type,
          item_id: reservation.item_id,
          date: reservation.date
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.basket.splice(index, 1);
      } catch (error) {
        console.error('Error removing from basket:', error);
      }
    }
  }
}
</script>

<style scoped>
.account-page {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Changed from center to flex-start */
  background: linear-gradient(to right, #ece9e6, #ffffff);
  padding: 20px;
  overflow-y: auto; 
  height: 100vh; /* Added to make the page take full viewport height */
}

.compte {
  text-align: center;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  overflow-y: auto; /* Added to make the content scrollable */
  max-height: 60vh; /* Added to limit the height of the content */
}

h2 {
  font-size: 2.5em;
  color: #34495E;
  margin-bottom: 20px;
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

.reservation-details {
  display: flex;
  align-items: center;
}

.reservation-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.reservation-info {
  text-align: left;
}

.reservation-info h3 {
  margin: 0;
  font-size: 1.5em;
  color: #2C3E50;
}

.reservation-info p {
  margin: 5px 0;
  font-size: 1em;
  color: #7F8C8D;
}

.btn-cancel, .btn-confirm, .btn-pay {
  background-color: #E74C3C;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.btn-cancel:hover, .btn-confirm:hover, .btn-pay:hover {
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
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  position: relative;
  max-width: 500px;
  width: 100%;
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

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  margin-bottom: 20px;
}
</style>