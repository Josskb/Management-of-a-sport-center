<template>
  <div id="app">
    <AppHeader />
    <MainSection />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/Header.vue';
import MainSection from './components/MainSection.vue';
import AppFooter from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    MainSection,
    AppFooter
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%; 
  width: 100%; 
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
