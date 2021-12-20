<template>
  <router-view />
</template>

<script>
  import{onBeforeMount} from 'vue';
  import {useRouter, useRoute} from 'vue-router';
  import firebase from 'firebase';

  export default{
    setup(){
      const router = useRouter();
      const route = useRoute();

      onBeforeMount(() => {
        firebase.auth().onAuthStateChanged((user) => { //if user goes from logged in to out, or vice versa
        if (route.path == "/" && user){
          router.replace('/calendar'); //redirects user to calendar, if they are at home
        } else if(!user && route.path == "/calendar"){
          router.replace('/login'); //redirects user to login, if they are NOT logged in and attempt to access calendar
        }else if ((route.path == "/login" || route.path == "/register") && user){
          router.replace('/calendar'); //redirects user to calendar, if they are already logged in
        }
        });
      });
    }
  }
</script>

<style lang="scss">
  body{
    background: #2c3e50;
    color: #FFF;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
  a{
    color: inherit;
  }

</style>
