<template>
    <!-- <div class="register">
        <h1> Register </h1>
        <form @submit.prevent="Register">
            <input type="text" placeholder="Email" v-model="email"/>
            <input type="password" placeholder="Password" v-model="password"/>
            <input type="submit" value="Regsiter" >
            <p>Have an account? <router-link to="/login">Login Here</router-link></p>
        </form>
    </div> -->
    <div class="container">
        <div class="screen">
            <div class="screen__content">
                <form class="register" @submit.prevent="Register">
                    <h1 class="header__text">Register</h1>
                    <div class="register__field">
                        <i class="register__icon fas fa-user"></i>
                        <input type="text" class="register__input" placeholder="Email" v-model="email">
                    </div>
                    <div class="register__field">
                        <i class="register__icon fas fa-lock"></i>
                        <input type="password" class="register__input" placeholder="Password" v-model="password">
                    </div>
                    <button class="button register__submit" aria-label="Sign up">
                        <span class="button__text">Sign Up Now</span>
                        <i class="button__icon fas fa-chevron-right"></i>
                    </button>
                </form>
                <button class="button goto__button"  @click="$router.push('login')" aria-label="Login to existing account">
                    <span class="button__text">Have an account?<br/>Login Here</span>
                    <i class="button__icon fas fa-chevron-right"></i>
                </button>	
                
            </div>
            <div class="screen__background">
                <span class="screen__background__shape screen__background__shape4"></span>
                <span class="screen__background__shape screen__background__shape3"></span>		
                <span class="screen__background__shape screen__background__shape2"></span>
                <span class="screen__background__shape screen__background__shape1"></span>
            </div>		
        </div>
    </div>
    <Footer/>
</template>

<script>
    import firebase from 'firebase';
    import {ref} from 'vue';
    import Footer from '../views/Footer.vue'

    export default{

        components: {
			Footer
		},

        setup(){
            const email = ref("");
            const password = ref("");

            const Register = () => {
                firebase 
                    .auth()
                    .createUserWithEmailAndPassword(email.value,password.value)
                    .then(user =>{
                        console.log(user) // do something with user to bypass unused variable
                        alert("Welcome to the calendar app!");
                    })
                    .catch(err => alert(err.message));
            }

            return{
                Register,
                email,
                password
            }
        }
    }
</script>

<style>
    /*register css*/

    @import url('https://fonts.googleapis.com/css?family=Raleway:400,700');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;	
        font-family: Raleway, sans-serif;
    }

    body {
        background: linear-gradient(90deg, #C7C5F4, #776BCC);		
    }

    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    .footer{
        margin-top: 120px;
    }

    .screen {		
        background: linear-gradient(90deg, #5D54A4, #7C78B8);		
        position: relative;	
        height: 600px;
        width: 360px;	
        box-shadow: 0px 0px 24px #5C5696;
    }

    .screen__content {
        z-index: 1;
        position: relative;	
        height: 100%;
    }

    .screen__background {		
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        -webkit-clip-path: inset(0 0 0 0);
        clip-path: inset(0 0 0 0);	
    }

    .screen__background__shape {
        transform: rotate(45deg);
        position: absolute;
    }

    .screen__background__shape1 {
        height: 520px;
        width: 520px;
        background: #FFF;	
        top: -50px;
        right: 120px;	
        border-radius: 0 72px 0 0;
    }

    .screen__background__shape2 {
        height: 220px;
        width: 220px;
        background: #6C63AC;	
        top: -172px;
        right: 0;	
        border-radius: 32px;
    }

    .screen__background__shape3 {
        height: 540px;
        width: 190px;
        background: linear-gradient(270deg, #5D54A4, #6A679E);
        top: -24px;
        right: 0;	
        border-radius: 32px;
    }

    .screen__background__shape4 {
        height: 400px;
        width: 200px;
        background: #7E7BB9;	
        top: 420px;
        right: 50px;	
        border-radius: 60px;
    }

    .register {
        width: 320px;
        padding: 30px;
        padding-top: 156px;
    }

    .register__field {
        padding: 20px 0px;	
        position: relative;	
    }

    .register__icon {
        position: absolute;
        top: 30px;
        color: #7875B5;
    }

    .register__input {
        border: none;
        border-bottom: 2px solid #D1D1D4;
        background: none;
        padding: 10px;
        padding-left: 24px;
        font-weight: 700;
        width: 75%;
        transition: .2s;
    }

    .register__input:active,
    .register__input:focus,
    .register__input:hover {
        outline: none;
        border-bottom-color: #6A679E;
    }

    .register__submit{
        background: #fff;
        font-size: 14px;
        margin-top: 30px;
        padding: 16px 20px;
        border-radius: 26px;
        border: 1px solid #D4D3E8;
        text-transform: uppercase;
        font-weight: 700;
        display: flex;
        align-items: center;
        width: 100%;
        color: #4C489D;
        box-shadow: 0px 2px 2px #5C5696;
        cursor: pointer;
        transition: .2s;
    }

    .goto__button {
        background: #fff;
        font-size: 14px;
        margin-top: 30px;
        padding: 16px 20px;
        border-radius: 26px;
        border: 1px solid #D4D3E8;
        text-transform: uppercase;
        font-weight: 700;
        display: flex;
        align-items: center;
        width: 100%;
        color: #4C489D;
        box-shadow: 0px 2px 2px #5C5696;
        cursor: pointer;
        transition: .2s;
    }

    .register__submit:active,
    .register__submit:focus,
    .register__submit:hover {
        border-color: #6A679E;
        outline: none;
    }

    .button__icon {
        font-size: 24px;
        margin-left: auto;
        color: #7875B5;
    }

    .header__text {
        color: #4C489D;
    }
</style>