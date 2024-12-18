<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to the Sport Center Management</h1>
        <p>Your one-stop solution for managing sports facilities and reservations.</p>
        <router-link to="/reservation"><button class="btn-primary">Make a Reservation</button></router-link>
      </div>
    </section>
    
    <section class="intro">
      <h2>About Our Center</h2>
      <p>We offer a wide range of sports facilities and equipment to cater to all your needs. Join us and stay active!</p>
    </section>
    <section class="features">
      <h2>Our Features</h2>
      <div class="feature-cards">
        <div class="feature-card">
          <h3>State-of-the-Art Facilities</h3>
          <p>Our center is equipped with the latest sports facilities to ensure you have the best experience.</p>
        </div>
        <div class="feature-card">
          <h3>Professional Trainers</h3>
          <p>Our team of professional trainers is here to help you achieve your fitness goals.</p>
        </div>
        <div class="feature-card">
          <h3>Flexible Memberships</h3>
          <p>We offer a variety of membership plans to suit your needs and schedule.</p>
        </div>
        <div class="feature-card">
          <h3>Easy Online Reservations</h3>
          <p>Our user-friendly reservation website allows you to book equipment and fields with ease.</p>
        </div>
      </div>
    </section>
    <section class="testimonials">
      <h2>What Our Members Say</h2>
      <div class="testimonial-cards">
        <div class="testimonial-card">
          <p>"The facilities are top-notch and the staff is incredibly friendly. I love coming here!"</p>
          <h4>- Alex</h4>
        </div>
        <div class="testimonial-card">
          <p>"The website make reservations so easy. It is perfect, gra gra boom"</p>
          <h4>- Guillaume</h4>
        </div>
        <div class="testimonial-card">
          <p>"I've never seen a website as convenient for booking sports. I recommend, mashala"</p>
          <h4>- Ilyes</h4>
        </div>
        <div class="testimonial-card">
          <p>"The online reservation system is so convenient. I can easily book my sessions anytime!"</p>
          <h4>- Maxime</h4>
        </div>
        <div class="testimonial-card">
          <p>"You prefer me or the website ? The website !"</p>
          <h4>- Paul</h4>
        </div>
      </div>
    </section>
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
import eventBus from '../eventBus';

export default {
  name: 'HomePage',
  data() {
    return {
      eventBus,
      showAuthPrompt: false
    };
  },
  computed: {
    isLoggedIn() {
      return this.eventBus.isLoggedIn;
    }
  },
  mounted() {
    setTimeout(() => {
      this.showAuthPrompt = true;
    }, 10000); // Show the prompt after 10 seconds
  }
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(to right, #ece9e6, #ffffff);
  padding: 20px;
  padding-bottom: 150px;
}

.hero {
  background: url('https://capp-ge.org/wp-content/uploads/2020/04/gymnase-Jean_burger-Thionville-diapo.jpg') no-repeat center center;
  background-size: cover;
  width: 100%;
  padding: 100px 20px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-content {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 40px;
  border-radius: 10px;
  max-width: 800px;
  text-align: center;
}

.hero h1 {
  font-size: 3em;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

.intro, .features, .testimonials, .auth-prompt {
  padding: 50px 20px;
  max-width: 800px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 20px 0;

}

.intro h2, .features h2, .testimonials h2, .auth-prompt h2 {
  font-size: 2.5em;
  color: #34495E;
  margin-bottom: 20px;
}

.intro p, .features p, .testimonials p, .auth-prompt p {
  font-size: 1.2em;
  color: #7F8C8D;
  line-height: 1.6;
}

.feature-cards, .testimonial-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.feature-card, .testimonial-card {
  background-color: #ECF0F1;
  padding: 20px;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.feature-card:hover, .testimonial-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.testimonial-card p {
  font-style: italic;
}

.testimonial-card h4 {
  margin-top: 10px;
  font-size: 1.2em;
  color: #2C3E50;
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
</style>