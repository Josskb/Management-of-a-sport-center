<template>
  <div class="admin-page">
    <div class="admin">
      <h2>Admin Panel</h2>
      <div class="button-section">
        <button class="btn-open" @click="showSportModal = true">Create Sport</button>
        <button class="btn-open" @click="showEquipmentModal = true">Add Equipment</button>
        <button class="btn-open" @click="showFieldModal = true">Add Field</button>
        <button class="btn-open" @click="showModifySportModal = true">Modify Sport</button>
        <button class="btn-open" @click="showModifyEquipmentModal = true">Modify Equipment</button>
        <button class="btn-open" @click="showModifyFieldModal = true">Modify Field</button>
        <button class="btn-open" @click="showUsersPanel = true">View Users</button>
      </div>

      <!-- Sport Modal -->
      <div v-if="showSportModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showSportModal = false">&times;</span>
          <h3>Create Sport</h3>
          <form @submit.prevent="createSport">
            <div class="form-group">
              <label for="sportName">Sport Name:</label>
              <input type="text" id="sportName" v-model="sportForm.name" required />
            </div>
            <div class="form-group">
              <label for="sportImage">Image URL:</label>
              <input type="text" id="sportImage" v-model="sportForm.imageUrl" />
            </div>
            <button type="submit" class="btn-submit">Create Sport</button>
          </form>
        </div>
      </div>

      <!-- Equipment Modal -->
      <div v-if="showEquipmentModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showEquipmentModal = false">&times;</span>
          <h3>Add Equipment</h3>
          <form @submit.prevent="addEquipment">
            <div class="form-group">
              <label for="equipmentName">Equipment Name:</label>
              <input type="text" id="equipmentName" v-model="equipmentForm.name" required />
            </div>
            <div class="form-group">
              <label for="equipmentPrice">Price:</label>
              <input type="number" id="equipmentPrice" v-model="equipmentForm.price" required />
            </div>
            <div class="form-group">
              <label for="equipmentSportId">Sport:</label>
              <select id="equipmentSportId" v-model="equipmentForm.sportId" required>
                <option v-for="sport in sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="equipmentImage">Image URL:</label>
              <input type="text" id="equipmentImage" v-model="equipmentForm.imageUrl" />
            </div>
            <button type="submit" class="btn-submit">Add Equipment</button>
          </form>
        </div>
      </div>

      <!-- Field Modal -->
      <div v-if="showFieldModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showFieldModal = false">&times;</span>
          <h3>Add Field</h3>
          <form @submit.prevent="addField">
            <div class="form-group">
              <label for="fieldName">Field Name:</label>
              <input type="text" id="fieldName" v-model="fieldForm.name" required />
            </div>
            <div class="form-group">
              <label for="fieldPrice">Price:</label>
              <input type="number" id="fieldPrice" v-model="fieldForm.price" required />
            </div>
            <div class="form-group">
              <label for="fieldSportId">Sport:</label>
              <select id="fieldSportId" v-model="fieldForm.sportId" required>
                <option v-for="sport in sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="fieldImage">Image URL:</label>
              <input type="text" id="fieldImage" v-model="fieldForm.imageUrl" />
            </div>
            <button type="submit" class="btn-submit">Add Field</button>
          </form>
        </div>
      </div>

      <!-- Modify Sport Modal -->
      <div v-if="showModifySportModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showModifySportModal = false">&times;</span>
          <h3>Modify Sport</h3>
          <ul class="item-list">
            <li v-for="sport in sports" :key="sport.id">
              {{ sport.name }}
              <button class="btn-delete" @click="deleteSport(sport.id)">Delete</button>
              <button class="btn-edit" @click="openModifySportModal(sport)">Edit</button>
            </li>
          </ul>
          <form v-if="modifySportForm.id" @submit.prevent="modifySport">
            <div class="form-group">
              <label for="modifySportName">Sport Name:</label>
              <input type="text" id="modifySportName" v-model="modifySportForm.name" required />
            </div>
            <div class="form-group">
              <label for="modifySportImage">Image URL:</label>
              <input type="text" id="modifySportImage" v-model="modifySportForm.imageUrl" />
            </div>
            <button type="submit" class="btn-submit">Modify Sport</button>
          </form>
        </div>
      </div>

      <!-- Modify Equipment Modal -->
      <div v-if="showModifyEquipmentModal" class="modal">
        <div class="modal-content scrollable">
          <span class="close" @click="showModifyEquipmentModal = false">&times;</span>
          <h3>Modify Equipment</h3>
          <div v-for="sport in sports" :key="sport.id" class="sport-section">
            <h4>{{ sport.name }}</h4>
            <ul class="item-list">
              <li v-for="equipment in sport.equipment" :key="equipment.id">
                {{ equipment.name }}
                <button class="btn-delete" @click="deleteEquipment(equipment.id)">Delete</button>
                <button class="btn-edit" @click="openModifyEquipmentModal(equipment)">Edit</button>
              </li>
            </ul>
          </div>
          <form v-if="modifyEquipmentForm.id" @submit.prevent="modifyEquipment">
            <div class="form-group">
              <label for="modifyEquipmentName">Equipment Name:</label>
              <input type="text" id="modifyEquipmentName" v-model="modifyEquipmentForm.name" required />
            </div>
            <div class="form-group">
              <label for="modifyEquipmentPrice">Price:</label>
              <input type="number" id="modifyEquipmentPrice" v-model="modifyEquipmentForm.price" required />
            </div>
            <div class="form-group">
              <label for="modifyEquipmentSportId">Sport:</label>
              <select id="modifyEquipmentSportId" v-model="modifyEquipmentForm.sportId" required>
                <option v-for="sport in sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="modifyEquipmentImage">Image URL:</label>
              <input type="text" id="modifyEquipmentImage" v-model="modifyEquipmentForm.imageUrl" />
            </div>
            <button type="submit" class="btn-submit">Modify Equipment</button>
          </form>
        </div>
      </div>

      <!-- Modify Field Modal -->
      <div v-if="showModifyFieldModal" class="modal">
        <div class="modal-content scrollable">
          <span class="close" @click="showModifyFieldModal = false">&times;</span>
          <h3>Modify Field</h3>
          <div v-for="sport in sports" :key="sport.id" class="sport-section">
            <h4>{{ sport.name }}</h4>
            <ul class="item-list">
              <li v-for="field in sport.fields" :key="field.id">
                {{ field.name }}
                <button class="btn-delete" @click="deleteField(field.id)">Delete</button>
                <button class="btn-edit" @click="openModifyFieldModal(field)">Edit</button>
              </li>
            </ul>
          </div>
          <form v-if="modifyFieldForm.id" @submit.prevent="modifyField">
            <div class="form-group">
              <label for="modifyFieldName">Field Name:</label>
              <input type="text" id="modifyFieldName" v-model="modifyFieldForm.name" required />
            </div>
            <div class="form-group">
              <label for="modifyFieldPrice">Price:</label>
              <input type="number" id="modifyFieldPrice" v-model="modifyFieldForm.price" required />
            </div>
            <div class="form-group">
              <label for="modifyFieldSportId">Sport:</label>
              <select id="modifyFieldSportId" v-model="modifyFieldForm.sportId" required>
                <option v-for="sport in sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="modifyFieldImage">Image URL:</label>
              <input type="text" id="modifyFieldImage" v-model="modifyFieldForm.imageUrl" />
            </div>
            <button type="submit" class="btn-submit">Modify Field</button>
          </form>
        </div>
      </div>

      <!-- Users Panel -->
      <div v-if="showUsersPanel" class="modal">
        <div class="modal-content">
          <span class="close" @click="showUsersPanel = false">&times;</span>
          <h3>Registered Users</h3>
          <ul class="item-list">
            <li v-for="user in users" :key="user.id" @click="selectUser(user)">
              {{ user.username }}
            </li>
          </ul>
        </div>
      </div>

      <!-- User Details Modal -->
      <div v-if="selectedUser" class="modal">
        <div class="modal-content">
          <span class="close" @click="selectedUser = null">&times;</span>
          <h3>{{ selectedUser.username }}'s Reservations</h3>
          <ul class="item-list">
            <li v-for="reservation in selectedUser.reservations" :key="reservation.id">
              {{ reservation.type === 'equipment' ? reservation.Equipment.name : reservation.Field.name }} - {{ reservation.date }} - Confirmed: {{ reservation.confirmed }}
              <button class="btn-cancel" @click="cancelReservation(reservation.id)">Cancel</button>
            </li>
          </ul>
          <button class="btn-ban" @click="confirmBanUser">Ban User</button>
        </div>
      </div>

      <!-- Confirm Ban Modal -->
      <div v-if="showConfirmBan" class="modal">
        <div class="modal-content">
          <span class="close" @click="showConfirmBan = false">&times;</span>
          <h3>Are you sure you want to ban this account?</h3>
          <button class="btn-confirm" @click="banUser">Yes</button>
          <button class="btn-cancel" @click="showConfirmBan = false">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Admin',
  data() {
    return {
      sports: [],
      sportForm: {
        name: '',
        imageUrl: ''
      },
      equipmentForm: {
        name: '',
        price: '',
        sportId: '',
        imageUrl: ''
      },
      fieldForm: {
        name: '',
        price: '',
        sportId: '',
        imageUrl: ''
      },
      modifySportForm: {
        id: '',
        name: '',
        imageUrl: ''
      },
      modifyEquipmentForm: {
        id: '',
        name: '',
        price: '',
        sportId: '',
        imageUrl: ''
      },
      modifyFieldForm: {
        id: '',
        name: '',
        price: '',
        sportId: '',
        imageUrl: ''
      },
      showSportModal: false,
      showEquipmentModal: false,
      showFieldModal: false,
      showModifySportModal: false,
      showModifyEquipmentModal: false,
      showModifyFieldModal: false,
      users: [],
      selectedUser: null,
      showUsersPanel: false,
      showConfirmBan: false
    };
  },
  async mounted() {
    await this.fetchSports();
    await this.fetchUsers();
  },
  methods: {
    async fetchSports() {
      try {
        const response = await axios.get('http://localhost:3000/sports');
        this.sports = response.data;
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    },
    async createSport() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/admin/sports', this.sportForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.sportForm.name = '';
        this.sportForm.imageUrl = '';
        await this.fetchSports(); // Refresh the sports list
        this.showSportModal = false;
      } catch (error) {
        console.error('Error creating sport:', error);
        alert(error.response.data.message);
      }
    },
    async addEquipment() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/admin/equipment', this.equipmentForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.equipmentForm.name = '';
        this.equipmentForm.price = '';
        this.equipmentForm.sportId = '';
        this.equipmentForm.imageUrl = '';
        this.showEquipmentModal = false;
      } catch (error) {
        console.error('Error adding equipment:', error);
        alert(error.response.data.message);
      }
    },
    async addField() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/admin/fields', this.fieldForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.fieldForm.name = '';
        this.fieldForm.price = '';
        this.fieldForm.sportId = '';
        this.fieldForm.imageUrl = '';
        this.showFieldModal = false;
      } catch (error) {
        console.error('Error adding field:', error);
        alert(error.response.data.message);
      }
    },
    async modifySport() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:3000/admin/sports/${this.modifySportForm.id}`, this.modifySportForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        await this.fetchSports(); // Refresh the sports list
        this.showModifySportModal = false;
      } catch (error) {
        console.error('Error modifying sport:', error);
        alert(error.response.data.message);
      }
    },
    async modifyEquipment() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:3000/admin/equipment/${this.modifyEquipmentForm.id}`, this.modifyEquipmentForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        await this.fetchSports(); // Refresh the sports list
        this.showModifyEquipmentModal = false;
      } catch (error) {
        console.error('Error modifying equipment:', error);
        alert(error.response.data.message);
      }
    },
    async modifyField() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:3000/admin/fields/${this.modifyFieldForm.id}`, this.modifyFieldForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        await this.fetchSports(); // Refresh the sports list
        this.showModifyFieldModal = false;
      } catch (error) {
        console.error('Error modifying field:', error);
        alert(error.response.data.message);
      }
    },
    async fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:3000/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async selectUser(user) {
      this.selectedUser = user;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/admin/users/${user.id}/reservations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.selectedUser.reservations = response.data;
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    },
    async cancelReservation(reservationId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/admin/reservations/${reservationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.selectedUser.reservations = this.selectedUser.reservations.filter(r => r.id !== reservationId);
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert(error.response.data.message);
      }
    },
    confirmBanUser() {
      this.showConfirmBan = true;
    },
    async banUser() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/admin/users/${this.selectedUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        this.users = this.users.filter(user => user.id !== this.selectedUser.id);
        this.selectedUser = null;
        this.showConfirmBan = false;
      } catch (error) {
        console.error('Error banning user:', error);
        alert(error.response.data.message || 'Error banning user');
      }
    },
    openModifySportModal(sport) {
      this.modifySportForm = { ...sport };
      this.showModifySportModal = true;
    },
    openModifyEquipmentModal(equipment) {
      this.modifyEquipmentForm = { ...equipment };
      this.showModifyEquipmentModal = true;
    },
    openModifyFieldModal(field) {
      this.modifyFieldForm = { ...field };
      this.showModifyFieldModal = true;
    },
    async deleteSport(sportId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/admin/sports/${sportId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        await this.fetchSports(); // Refresh the sports list
      } catch (error) {
        console.error('Error deleting sport:', error);
        alert(error.response.data.message);
      }
    },
    async deleteEquipment(equipmentId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/admin/equipment/${equipmentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        await this.fetchSports(); // Refresh the sports list
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert(error.response.data.message);
      }
    },
    async deleteField(fieldId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/admin/fields/${fieldId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(response.data.message);
        await this.fetchSports(); // Refresh the sports list
      } catch (error) {
        console.error('Error deleting field:', error);
        alert(error.response.data.message);
      }
    }
  }
};
</script>

<style scoped>
.admin-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 15vh;
  background: linear-gradient(to right, #ece9e6, #ffffff);
  padding: 20px;
  overflow-y: auto; /* Enable vertical scrolling */
}

.admin {
  text-align: center;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
}

h2 {
  font-size: 2.5em;
  color: #34495E;
  margin-bottom: 20px;
}

.button-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.btn-open {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-open:hover {
  background-color: #2980b9;
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
  z-index: 1000; /* Ensure the modal is above other content */
}

.modal-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  position: relative;
  max-width: 600px;
  width: 100%;
}

.modal-content.scrollable {
  max-height: 80vh;
  overflow-y: auto;
}

.item-list {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}

.item-list li {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.item-list li:hover {
  background-color: #f0f0f0;
}


.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5em;
  cursor: pointer;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 2em;
  color: #2C3E50;
  margin-bottom: 15px;
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

select {
  width: 104%;
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
  transition: background-color 0.3s, transform 0.3s;
}

.btn-submit:hover {
  background-color: #C0392B;
  transform: scale(1.05);
  border-radius: 5px;
}

.btn-cancel {
  background-color: #E74C3C;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-cancel:hover {
  background-color: #C0392B;
  transform: scale(1.05);
}

.btn-ban {
  background-color: #E74C3C;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-ban:hover {
  background-color: #C0392B;
  transform: scale(1.05);
}

.btn-confirm {
  background-color: #27AE60;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-confirm:hover {
  background-color: #229954;
  transform: scale(1.05);
}

.btn-delete {
  background-color: #E74C3C;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-left: 10px;
}

.btn-delete:hover {
  background-color: #C0392B;
  transform: scale(1.05);
}

.btn-edit {
  background-color: #3498db;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-left: 10px;
}

.btn-edit:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}
</style>

