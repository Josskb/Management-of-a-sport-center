<template>
  # Node modules
node_modules/

# Build output
/dist/

# Log files
npm-debug.log*

# IDE files
.idea/
.vscode/

# OS-specific files
.DS_Store

    <div class="compte">
      <h2>Mon Compte</h2>
      <p>Réservations passées :</p>
      <ul>
        <li v-for="(reservation, index) in reservations" :key="index" class="reservation-item">
          <span>{{ reservation.sport }} - {{ reservation.date }}</span>
          <button class="btn-cancel" @click="cancel(index)">Annuler</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Compte',
    data() {
      return {
        reservations: [
          { sport: 'Football', date: '2024-12-05' },
          { sport: 'Basketball', date: '2024-12-07' }
        ]
      };
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
  s