<template>
  <div class="card">
    <div class="card-body">

      <h4 v-if="note.title && note.title.trim() !== '' " class="card-text">
        {{ note.title }}
      </h4>
      <h4 v-else class="card-text">
        Esta nota no tiene titulo
      </h4>

      <h6 v-if="isAdmin" class="card-subtitle mb-2 text-muted">
        <router-link class="card-link" :to="'/notes/user/' + note.owner">
          {{ note.owner }}
        </router-link>
      </h6>

      <p v-if="note.content && note.content.trim() !== ''" class="card-text">{{ note.content }}</p>
      <p v-else class="card-text">This note doesn't have content</p>

      <router-link class="card-text" :to="'/notes/' + note.id">
        {{ note.timestamp.toLocaleDateString() }} -
        {{ note.timestamp.toLocaleTimeString() }}
      </router-link>
      <div v-if="note.categories.length > 0" style="display:flex;flex-direction:row;margin:auto;margin-bottom:20px;">
        <span v-for="(category, index) in note.categories" :key="index">
          <span  class="catName" @click="filtrarPorCats(category.name)"> {{ category.name }}</span>
          <span v-if="index < note.categories.length - 1" class="catName" >,</span>
        </span>

      </div>
      <h6 v-else class="card-subtitle mb-4">This note doesn't have categories</h6>

      <div v-if="isAdmin">
        <h6 v-if="note.archived" class="card-subtitle mb-4"> Archivada</h6>
        <h6 v-if="!note.archived" class="card-subtitle mb-4"> No Archivada</h6>
      </div>

        <div style="display:flex;flex-direction: column;justify-content: center;">
          <div class="bottomButtons">
            <router-link v-if="!auth.isAdmin()" class="detailsButton" :to="'/notes/' + note.id + '/edit'">
            editar
            </router-link>
            <button v-if="!auth.isAdmin() && note.archived==false" class="detailsButton" @click="archivarNota()">
              archivar
            </button>
            <button v-if="!auth.isAdmin() && note.archived==true" class="detailsButton" @click="desarchivarNota()">
              desarchivar
            </button>
            <button v-if="!auth.isAdmin()" class="detailsButton" @click="eliminarNota()">
              eliminar
            </button>

          </div>

          <div class="mt-3" style="display:flex;flex-direction:row; width:100%;margin: auto;">
              <router-link class="detailsButton2" :to="'/notes/' + note.id">
                Detalles
              </router-link>
          </div>

        </div>



    </div>
  </div>
</template>

<script>

import auth from "../common/auth.js";
/*import NoteRepository from "../repositories/NoteRepository.js";*/

export default {
  data(){
    return{

      isAdmin: null,
      auth,

    }

  },

  methods:{

    archivarNota(){
  
      try{

        this.$emit('archive-note', this.note.id);


      }catch(e){

        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }

      }
    },
    desarchivarNota(){
      try{

        this.$emit('dearchive-note', this.note.id);


        }catch(e){

        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }

        }
    },    
    
    eliminarNota(){
  
      try{

        this.$emit('delete-note', this.note.id);


      }catch(e){

        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }

      }
    },

    filtrarPorCats(category){
      console.log("Emito filtro")
      this.$emit('filtrar-cats', category);
      console.log("Acabo de eliminar filtro")

    }


  },

  props: {
    note: {
      type: Object,
      required: true
    }
  },
  mounted(){

    this.isAdmin = auth.isAdmin()

  }
};
</script>

<style scoped>
h6::after {
  content: "\00a0 ";
}

.xd{

  display:flex;
  flex-direction:row;

}

.bottomButtons{

  display: flex;
  flex-direction: row;
  justify-content: space-around;

}

.card{

background-color: #252525;
height: 100%;
width: 100%;

}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-text{

color: #ececec;
margin-bottom: 15px;


}

.card-subtitle{

color: #ececec

}

.detailsButton{

  color: #ececec;
  text-decoration: none;
  min-width: 25%;
  width: 75%;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 5px;
  background-color: #161616;
  color: #ececec;
  text-transform: capitalize;
  transition:all;
  transition-duration: 200ms;
  margin-top: auto;
  margin-left: 10px;
  margin-right: 10px;

}

.detailsButton:hover {
  
  background-color: #353535;

}

.detailsButton2{

  color: #ececec;
  text-decoration: none;
  min-width: 50%;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 5px;
  background-color: #161616;
  color: #ececec;
  text-transform: capitalize;
  transition:all;
  transition-duration: 200ms;
  margin-top: auto;
  margin-left: 10px;
  margin-right: 10px;

}

.detailsButton2:hover {

  background-color: #353535;

}

.catName {
  text-decoration: underline;
  color: #ececec;
  cursor: pointer;
  /*transition: color 0.3s ease;*/
}


</style>
