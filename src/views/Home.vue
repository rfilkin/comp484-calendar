<template>
  <div class="home">
    <h1>Welcome, {{ name }}</h1>
    <br>
    <button class="logout" @click="Logout">Logout</button>
  </div>
</template>

<script>
  import { ref, onBeforeMount } from 'vue';
  import firebase from 'firebase';

  export default {
    setup() {
      const name = ref("");

      onBeforeMount(() => {
        const user = firebase.auth().currentUser; //if someone is logged in, what is their username?
        if (user) {//if user exists...
          name.value = user.email.split('@')[0]; //split at the @ sign, and return first item in that list (the item before the @)
        }
      });

      const Logout = () => {
        firebase
          .auth()
          .signOut()
          .then(() => console.log("Signed out."))
          .catch(err => alert(err.message));
      }

      return {
          name,
          Logout
      }
    }
  }
</script>
