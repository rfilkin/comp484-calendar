<template>
    <div class = "navbar" role = "banner">
        <h1 class = "welcomeMessage">Welcome, {{ name }}</h1>
        <button class = "logout"
            type="button"
            @click="Logout"                
            aria-label="Log out button"
          >
          Logout
            <i class="fas fa-sign-out-alt"></i>
          </button>
    </div>
</template>

<script>

// code for login stuff
  import { ref, onBeforeMount } from 'vue';
  import firebase from 'firebase';

  export default {
    name: 'Navbar',
     methods: {
      close() {
        this.$emit('close');
      },
    },
    setup() {
      const name = ref("");
      
      onBeforeMount(() => {
        //const user = firebase.auth().currentUser; //if someone is logged in, what is their username?
        firebase.auth().onAuthStateChanged(function(user)
        {
        if (user != null)
        {
          if (user) {//if user exists...
          name.value = user.email.split('@')[0]; //split at the @ sign, and return first item in that list (the item before the @)
        }
        }
        else{
          console.log("Error retrieving username...");
        }
        });
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



<style>
.navbar{
  height: 40px;
  width: 100%;
  background: #cccccc;
}

.welcomeMessage{
  float: left;
  margin-left: 140px;
  color: rgb(24, 24, 24);
  margin-top: 4px;
}
.logout{
  float: right;
  width: 80px;
  margin-right: 20px;
  margin-top: 8px;
}
</style>