<template>
  <footer class="footer">
    <nav>
      <router-link to="/about">About Us</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>
    <p>&copy; 2024 KEIB Josselin and SANCESARIO Tom. All Rights Reserved.</p>
    
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
  position: relative;
}

.footer nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.footer a{
  color: white;
  text-decoration: none;
  background-color: #595959;
  padding: 0.5vh;
  border-radius: 10px;
  margin-top: 10px;
}

.footer a:hover{
  animation: shadow-drop-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes shadow-drop-center {
  0% {
    box-shadow: 0 0 0 0 rgba(63, 63, 63, 0.984);
  }
  100% {
    box-shadow: 0 0 20px 0px rgb(106, 106, 106);
  }
}
</style>
