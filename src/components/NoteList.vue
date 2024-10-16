<template>
  <div class="outerBox">
    <h1 class="titulo">Lista de notas</h1>
    <h2 class="titulo">Numero de notas: {{ this.count }}</h2>
    <div class="rowMainPage">
      <router-link v-if="!auth.isAdmin()" class="createButton" :to="{ name: 'NoteCreate' }">
        Crear nueva nota
      </router-link>
      <button class=" createButton" @click="resetFilters()"> Reiniciar filtro de categorias</button>
      <router-link v-if="auth.isAdmin()" class="createButton" :to="{ name: 'NoteList' }">
        Reiniciar filtro usuarios
      </router-link>
      <h5 class="filtrosText"> Filtros: </h5>
      <select name="filters" id="filters" class="selectFilters" v-model="this.selectedFilter" @change="applyFilters()">

        <option value="No Archivadas">No archivadas</option>
        <option value="Archivadas">Archivadas</option>
        <option value="Todas">Todas</option>

      </select>
      
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 grid">
      <div class="col mb-3" v-for="note in notasFinales" :key="note.id">
        <NoteCard :note="note" @dearchive-note="handleDearchiveNote" @archive-note="handleArchiveNote" @delete-note="handleDeleteNote" @filtrar-cats="handleFiltrarCats"></NoteCard>
        
      </div>
    </div>
  </div>

</template>

<script>
import UserRepository from "@/repositories/UserRepository";
import NoteRepository from "../repositories/NoteRepository";
import NoteCard from "./NoteCard.vue";
import Swal from "sweetalert2";
import auth from "@/common/auth.js"

export default {
  data() {
    return {

      notes: [],
      notesWithCats: [],
      notasFinales: [],
      selectedFilter: null,
      activeUsers: [],
      auth,
      count: 0,

    };
  },
  methods:{

    async handleArchiveNote(noteId) {

      const note = this.notesWithCats.find(n => n.id === noteId);
      if (note) {
        note.archived = true;
      }

      await NoteRepository.save(note)

      this.applyFilters()
    },

    async handleDearchiveNote(noteId){

      const note = this.notesWithCats.find(n => n.id === noteId);
      if (note) {
        note.archived = false;
      }

      await NoteRepository.save(note)

      this.applyFilters()

    },

    async handleDeleteNote(noteId) {
      console.log("Eliminar")
      const note = this.notes.find(n => n.id === noteId);

      Swal.fire({
        title: "Estás seguro?",
        html: "<p class='alertText'>No podrás revertir esto.</p>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, eliminalo",
        background: '#353535',
        customClass: {
        title: 'alertText',
        confirmButton: 'alertConfirm',
        cancelButton: 'alertCancel',
        popup: 'alertPopup',
      },
      }).then( async (result) => {
        if (result.isConfirmed) {

          await NoteRepository.delete(note.id)

          Swal.fire({
            title: "Eliminada",
            html: "<p class='alertText'>La nota ha sido eliminada</p>",
            icon: "success",
            background: '#353535',
            customClass: {
              title: 'alertText',
              confirmButton: 'alertConfirm',
              cancelButton: 'alertCancel',
              popup: 'alertPopup',
            },
          }).then(async (successResoult) => {

              if(successResoult.isConfirmed){
                console.log("Elimino")
                this.notes = await NoteRepository.findAll();
                this.notesWithCats = this.notes.filter(note => !note.archived);
                this.applyFilters()

              }

          });
        }
      });


    },

    handleFiltrarCats(catName) {

      this.notesWithCats = this.notes.filter(note => 
      note.categories.some(category => category.name === catName)
      );

      this.applyFilters();

    },

    filterArchivedNotes(notes){

      return notes.filter(note => !note.archived);

    },

    applyFilters(){

      switch(this.selectedFilter){
        
        case "Archivadas":
          this.notasFinales = this.notesWithCats.filter(note => note.archived)
          this.notasFinales.sort((a, b) => b.timestamp - a.timestamp);
          this.count = this.notasFinales.length
          break;

        case "Todas":
          this.notasFinales = this.notesWithCats
          this.notasFinales.sort((a, b) => b.timestamp - a.timestamp);
          this.count = this.notasFinales.length
          break;

        case "No Archivadas":
          this.notasFinales = this.notesWithCats.filter(note=>!note.archived)
          this.notasFinales.sort((a, b) => b.timestamp - a.timestamp);
          this.count = this.notasFinales.length
          break;
      }

    },

    resetFilters(){

      this.notesWithCats = this.notes;
      this.applyFilters();

    },

    async getActiveUsers(){

      this.activeUsers = await UserRepository.findAll();
      this.activeUsers = this.activeUsers.filter(user => user.active).map(user => user.login);

    },

    filterNotesByActiveUsers(){

      this.notes = this.notes.filter(note => this.activeUsers.includes(note.owner));

    },

    resetUsers(){

      this.filterNotesByActiveUsers();
      this.notesWithCats = this.notes
      this.notasFinales = this.notesWithCats.filter(note => !note.archived)
      this.notasFinales.sort((a, b) => b.timestamp - a.timestamp);
      this.count = this.notasFinales.length

    }


  },
  watch: {
    async $route(to) {
      this.notes = await NoteRepository.findAll();
      console.log("watcher", to.params.userName)
      if(to.params.userName != null){

        this.notes = this.notes.filter(note => note.owner == to.params.userName);
        this.filterNotesByActiveUsers();
        this.notesWithCats = this.notes
        this.notasFinales = this.notesWithCats.filter(note => !note.archived)
        this.notasFinales.sort((a, b) => b.timestamp - a.timestamp);
        this.count = this.notasFinales.length

      }else{

        this.resetUsers()

      }

    }
  },
  components: { NoteCard },
  
  async mounted() {
    if(auth.isAdmin()){

      this.getActiveUsers();

    }

    this.notes = await NoteRepository.findAll();
    console.log(this.notes)

    if(auth.isAdmin()){

      if(this.$route.params.userName != null){
        console.log(this.$route.params.userName)

        this.notes = this.notes.filter(note => note.owner == this.$route.params.userName);

      }else{
        this.filterNotesByActiveUsers();
      }

    }

    this.notesWithCats = this.notes
    this.notasFinales = this.notesWithCats.filter(note => !note.archived)

    if(auth.isAdmin()){

      this.selectedFilter = "Todas"
      this.applyFilters()

    }else{

      this.selectedFilter = "No Archivadas"
      this.applyFilters()

    }

  }
};
</script>

<style>

.rowMainPage{

  display:flex;
  flex-direction:row;

}

.filtrosText{

width: 10%;
margin-right: -60px;
margin-top: 25px;
color: #ececec

}


.titulo{

  margin-top: 40px;

  color: #ececec

}

.createButton{

  width: 100%;
  max-width: 285px;
  color: #ececec;
  float: left;
  text-decoration: none;
  margin-left: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 5px;
  background-color: #161616;
  color: #ececec;
  text-transform: capitalize;
  transition:all;
  transition-duration: 200ms;

}

.createButton:hover {
  
  background-color: #353535;

}

.selectFilters{

  width: 100%;
  max-width: 285px;
  color: #ececec;
  float: left;
  text-decoration: none;
  margin-left: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 5px;
  background-color: #161616;
  color: #ececec;
  text-transform: capitalize;
  transition:all;
  transition-duration: 200ms;

}

.selectFilters:hover {

  background-color: #353535;

}

.grid{

 margin-left: 10px;
 margin-right: 5px;
 overflow: auto;

}


</style>
