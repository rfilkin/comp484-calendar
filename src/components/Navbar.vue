<template>
    <div class = "navbar">
        <h1 class = "welcomeMessage">Welcome, Jimmy De Santa</h1>
        <button class = "logout"
            type="button"
            @click="close"                
            aria-label="Log out button"
          >
          Logout
            <font-awesome-icon icon = "sign-out-alt" /> 
          </button>
    </div>
</template>

<script>
  export default {
    name: 'Navbar',
     methods: {
      close() {
        this.$emit('close');
      },
    },
  };

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