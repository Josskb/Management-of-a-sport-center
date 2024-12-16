import { reactive, watch } from 'vue';

const getItem = (key) => {
  const item = localStorage.getItem(key);
  if (item === null || item === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return null;
  }
};

const eventBus = reactive({
  isLoggedIn: getItem('isLoggedIn') || false,
  userName: localStorage.getItem('userName') || '',
  email: localStorage.getItem('userEmail') || '', // Add email property
  isAdmin: getItem('isAdmin') || false
});

watch(() => eventBus.isLoggedIn, (newVal) => {
  localStorage.setItem('isLoggedIn', JSON.stringify(newVal));
});

watch(() => eventBus.userName, (newVal) => {
  localStorage.setItem('userName', newVal);
});

watch(() => eventBus.email, (newVal) => { // Watch email property
  localStorage.setItem('userEmail', newVal);
});

watch(() => eventBus.isAdmin, (newVal) => {
  localStorage.setItem('isAdmin', JSON.stringify(newVal));
});

export default eventBus;