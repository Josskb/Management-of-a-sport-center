<template>
    <main class="main-section">
      <section class="hero">
        
        <p>This is a short description of the page</p>
        <button @click="onClick">Learn More</button>
      </section>
  
      <section class="content">
        <div class="content-left">
          <h2>List of Items</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
        <div class="content-right">
          <h2>Details</h2>
          <p>This is where the detailed description will go.</p>
        </div>
      </section>
    </main>
  </template>
  
  <script>
  export default {
    name: 'MainSection',
    methods: {
      onClick() {
        alert('More Information Coming Soon!');
      }
    }
  }
  </script>
  
  <style scoped>
  .main-section {
    padding: 2rem;
  }
  
  .hero {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .hero h1 {
    font-size: 2rem;
    color: #333;
  }
  
  .hero button {
    padding: 1rem 2rem;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .hero button:hover {
    background-color: #0056b3;
  }
  
  .content {
    display: flex;
    justify-content: space-between;
  }
  
  .content-left,
  .content-right {
    width: 45%;
  }
  
  .content-left ul {
    list-style-type: none;
    padding: 0;
  }
  
  .content-left li {
    padding: 0.5rem 0;
  }
  </style>
  