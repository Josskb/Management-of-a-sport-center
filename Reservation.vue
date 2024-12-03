<template>
    <div class="reservation">
      <h2>Réserver un équipement ou un terrain</h2>
      <div v-for="sport in sports" :key="sport.name" class="sport-card">
        <h3>{{ sport.name }}</h3>
        <p>Prix: {{ sport.price }}€</p>
        <button class="btn-reserve" @click="reserve(sport)">Réserver</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Reservation',
    data() {
      return {
        sports: [
          { name: 'Football', price: 10 },
          { name: 'Basketball', price: 12 },
          { name: 'Tennis', price: 8 },
          { name: 'Badminton', price: 6 }
        ]
      };
    },
    methods: {
      reserve(sport) {
        alert(`Réservation pour ${sport.name} à ${sport.price}€`);
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
  </style>
  