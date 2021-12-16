import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

// Calendar page
import './main.css'
// need to fix font-awesome error, commented out for now

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash)
library.add(faSignOutAlt)

createApp(App).component("font-awesome-icon", FontAwesomeIcon);




// Calendar End
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
