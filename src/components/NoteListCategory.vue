<template>
    <div class="outerBox">
      <h1 class="titulo">Lista de notas por categoria</h1>
      <h2 class="titulo">Numero de notas: {{ this.count }}</h2>
      <div class="rowMainPage">
        <button class=" createButton" @click="resetFilters()"> Reiniciar filtro categorias</button>
        <h5 class="filtrosText"> Filtros: </h5>
        <select name="filters" id="filters" class="selectFilters" v-model="this.selectedFilter" @change="applyFilters()">
  
          <option value="No Archivadas">No archivadas</option>
          <option value="Archivadas">Archivadas</option>
          <option value="Todas">Todas</option>
  
        </select>
        
      </div>
  
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 grid">
        <div class="col mb-3" v-for="note in notasFinales" :key="note.id">
          <NoteCard :note="note" @filtrar-cats="handleFiltrarCats"></NoteCard>
          
        </div>
      </div>
    </div>
  
  </template>

<script>
import UserRepository from "@/repositories/UserRepository";
import NoteRepository from "../repositories/NoteRepository";
import NoteCard from "./NoteCard.vue";
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

    handleFiltrarCats(catName) {

      this.notesWithCats = this.notes.filter(note => 
      note.categories.some(category => category.name === catName)
      );

      this.applyFilters();

      this.$router.push({ name: 'notesByCategory', params: { categoryName: catName } });

    },

    filterArchivedNotes(notes){

      return notes.filter(note => !note.archived);

    },

    applyFilters(){

      switch(this.selectedFilter){
        
        case "Archivadas":
          this.notasFinales = this.notesWithCats.filter(note => note.archived)
          this.count = this.notasFinales.length
          break;

        case "Todas":
          this.notasFinales = this.notesWithCats
          this.count = this.notasFinales.length
          break;

        case "No Archivadas":
          this.notasFinales = this.notesWithCats.filter(note=>!note.archived)
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

    }


  },
  components: { NoteCard },
  
  async mounted() {
    if(auth.isAdmin()){

      this.getActiveUsers();

    }

    this.notes = await NoteRepository.findAll();

    if(auth.isAdmin()){

      this.filterNotesByActiveUsers();

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

    const cat = this.$route.params.categoryName;
    console.log(cat)
    this.handleFiltrarCats(cat)

  }
};
</script>