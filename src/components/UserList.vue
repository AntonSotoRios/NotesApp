<template>
    <div>
        <h1 class="title mt-4 mb-3">Lista de usuarios</h1>
    </div>
    <div class="userListBox">

        <li class="userList" v-for="(user, index) in users" :key="user.id" > 

            <div>

                <router-link class="userLogin" :to="{ name: 'notesByUser', params: { userName: user.login }  }"> {{ user.login }}</router-link>

                <span class="userLogin" v-if="user.active==true">&nbsp;&nbsp;&nbsp;&nbsp; Activo</span>

                <span class="userLogin" v-if="user.active!=true">&nbsp;&nbsp;&nbsp;&nbsp; Desactivado</span>

                <button class="userListButton" @click="deleteUser(index)"> Delete user </button>

                <button class="userListButton" v-if="user.active==true" @click="deactivateUser(index)"> Deactivate user</button>

                <button class="userListButton" v-if="user.active!=true" @click="activateUser(index)"> Activate user</button>
                
            </div>
        
            <div v-if="index < users.length-1" class="divider"/>

        </li>



        
    </div>

</template>
  
<script>
    import UserRepository from "../repositories/UserRepository.js";
    export default {
        data(){

            return{

                users: []

            };

        },

        methods:{

            async deleteUser(index){

                var deleteId = this.users[index].id

                await UserRepository.deleteUser(deleteId);

                this.findUsers();

            },

            async deactivateUser(index){

                var deactivateId = this.users[index].id

                await UserRepository.deactivateUser(deactivateId);

                this.findUsers();

            },

            async activateUser(index){

                var activateId = this.users[index].id

                await UserRepository.activateUser(activateId);

                this.findUsers();    

            },

            async findUsers(){

                this.users = await UserRepository.findAll()
                console.log("users", this.users)
            }

        },

        async mounted() {

            this.findUsers();

        }
    };
</script>

<style>

.userList{

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    list-style-type: none;
    margin: 20px;

}

.userListBox {

    border-radius: 5px;
    border: 1px solid #78797c;
    min-width: 700px;
    max-width: 35vw;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    padding: 20px;
    background-color: #252525

}

.userLogin{

    text-align: start;
    color: #ececec;
    margin-bottom: 5px;

}

.userListButton{

margin-left: 40px;
max-width: 30%;
border-radius: 5px;
border: 1px solid #78797c;
padding: 5px 20px;
background-color: #161616;
color: #ececec;
text-transform: capitalize;
transition:all;
transition-duration: 200ms;
margin-top: -5px;

}

.userListButton:hover {

background-color: #353535;

}

</style>