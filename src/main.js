import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCWY7G0MgW3oG1JYgeRWidIwUdlOEkCiB0",
  authDomain: "calendarapp-2d231.firebaseapp.com",
  projectId: "calendarapp-2d231",
  storageBucket: "calendarapp-2d231.appspot.com",
  messagingSenderId: "602352960714",
  appId: "1:602352960714:web:f8b75cb7f950466187e033"
};

firebase.initializeApp(firebaseConfig);
createApp(App).use(router).mount('#app')
