import { reactive, watch } from 'vue';

const eventBus = reactive({
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
  userName: localStorage.getItem('userName') || ''
});

watch(() => eventBus.isLoggedIn, (newVal) => {
  localStorage.setItem('isLoggedIn', JSON.stringify(newVal));
});

watch(() => eventBus.userName, (newVal) => {
  localStorage.setItem('userName', newVal);
});

export default eventBus;