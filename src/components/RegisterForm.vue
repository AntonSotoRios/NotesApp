<template>
    <div class="outerBox">
      <div class="titleBox" ><h1 class= "title"> Registrarse</h1></div>
      
      <div class="box">
        <div class="mb-3 mt-3 login">
          <label class="loginText" for="login">Usuario  </label>
          <input class="inputClass" placeholder="Inserte el usuario" type="text" id="login" v-model="auxLogin" @keyup.enter="autenticarme()" />
        </div>
        <div class="mb-3 login">
          <label class="loginText" for="pass">Contraseña </label>
          <input class="inputClass" placeholder="Inserte la contraseña" type="password" id="pass" v-model="auxPass" @keyup.enter="autenticarme()" />
        </div>
        <div class="mb-3 login">
          <label class="loginText" for="pass">Repetir Contraseña </label>
          <input class="inputClass" placeholder="Inserte otra vez la contraseña" type="password" id="pass" v-model="auxPassR" @keyup.enter="autenticarme()" />
        </div>
        <div class="divider"/>
        <div>
          <button class="authButton" @click="registrarme()">registrarme</button>
        </div>
        <div>
          <button class="registerButton" @click="goToLogin()">Ya tienes cuenta? Pulsa aqui para iniciar sesión</button>
        </div>
      </div>
    </div>
  
    <!--Buscar el estilo del focus -->
  </template>
  
  <script>
  import auth from "../common/auth.js";
  
  export default {
    data() {
      return {
        auxLogin: null,
        auxPass: null,
        auxPassR: null,
      };
    },
    methods: {
      async registrarme() {
        try {
          if(this.auxPass != this.auxPassR){
            throw new Error("Las contraseñas no coinciden")
          }
          
          await auth.register({
            login: this.auxLogin,
            password: this.auxPass
          });

          await auth.login({
            login: this.auxLogin,
            password: this.auxPass
          });
          this.$router.push("/notes");
        } catch (e) {
          console.error(e);
          if (e.response?.data?.message) {
            alert(e.response.data.message);
          } else {
            alert(e.message);
          }
        }
      }, 
  
      goToLogin(){
  
        this.$router.push("/")
  
      }
  
    }
  };
  </script>
  
  <style>
  
  .box {
  
    border-radius: 5px;
    border: 1px solid #78797c;
    min-width: 21vw;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    padding: 20px;
    background-color: #252525
  
  }

  .titleBox {

    margin-bottom: 5px;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    padding: 20px;
    width: 100vh;

  }
  
  .outerBox {
  
    display:flex;

    flex-direction: column;
  
    height: 90vh;
  
    background-color: #161616;
  
  }
  
  .login{
  
    display: flex;
    flex-direction: column;
  
  }
  
  .loginText{
  
    text-align: start;
    color: #ececec;
    margin-bottom: 5px;
  
  
  }

  .title {

    text-align: center;
    color: #ececec;
    margin-bottom: 5px;

  }
  
  .authButton{
  
    width: 100%;
    border-radius: 5px;
    border: 1px solid #78797c;
    padding: 5px;
    background-color: #161616;
    color: #ececec;
    text-transform: capitalize;
    transition:all;
    transition-duration: 200ms;
  
  }
  
  .authButton:hover {
  
    background-color: #353535;
  
  }
  
  .divider {
  
    border-top: 1px solid #78797c;
    margin: 15px 0;
  
  }
  
  .inputClass {
  
    background-color: #252525;
    color: #ececec;
    border-radius: 5px;
    border: 1px solid #78797c;
    padding: 5px 10px;
    
  }
  
  .registerButton {
  
    background: none;
    color: #ececec;
    border: none;
    margin-top: 20px;
    text-decoration: underline;
    cursor: pointer;
  
  }
  
  
  </style>
  