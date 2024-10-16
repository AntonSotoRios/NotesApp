<template>
  <div class="outerBox">

    <div>
      <h1 class="titulo">Nueva nota</h1>
    </div>

    <div class="noteFormBox">

      <div class="mb-3 mt-1 login">
        <label class="loginText" for="login">Título  </label>
        <input class="inputClass" placeholder="Inserte el título" type="text" id="titulo" v-model="auxTitulo"/>
      </div>

      <div class="mb-3 login">
        <label class="loginText" for="login">Descripción  </label>
        <textarea class="inputClass" placeholder="Inserte la Descripción" type="text" id="descripcion" v-model="auxDescripcion"/>
      </div>

      <div class="loginCat">
          <label class="categoriasText" for="login">Categorías</label>  
      </div>

      <div class="categoriasBox mt-1">

        <div class="loginCat">

          <select v-if="categories.length > 0" class="selectCat" v-model="selectedCategory" name="categorias" id="categorias">
            <option v-for="category in categories" :key="category.id" :value="category">
            {{ category.name }}
            </option>
          </select>

          <div class="">
            <button v-if="categories.length > 0" class="addButton" @click="addCategory()">Add</button>
          </div>

        </div>



        <div class="mb-3 mt-1">
          <li class="mt-1 subListaCats" v-for="(category, index) in noteCategories" :key="category.id">
            - {{ category.name }}
            <button class="deleteButton" @click="deleteFromList(index)">X</button>
          </li>
        </div>

      </div>

      <div>
        <button class="authButton" @click="addNote()">Create Note</button>
      </div>

    </div>

  </div>

  
</template>

<script>
import NoteRepository from "@/repositories/NoteRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
export default {
  data() {
    return {
      auxTitulo: '',
      auxDescripcion: '',
      selectedCategory: {},
      categories: [],
      noteCategories: []
    };
  },
  methods: {
    
    async fetchCategories(){
      try {
        
        this.categories = await CategoryRepository.findAll();

      } catch (e) {
        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }
      }
    },

    addCategory(){

      this.categories = this.categories.filter(item => item.id !== this.selectedCategory.id)

      this.noteCategories.push(this.selectedCategory);

      this.selectedCategory = {}

    },

    deleteFromList(index){

      this.categories.push(this.noteCategories[index])

      this.categories.sort((a, b) => a.name.localeCompare(b.name))

      this.noteCategories.splice(index, 1);

    },

    async addNote(){

      var note = {};

      try{

        if((this.auxTitulo == null && this.auxDescripcion == null) || (this.auxTitulo == '' && this.auxDescripcion == '')){

          throw new Error("Parámentros vacíos")

        }

        if(this.auxTitulo.length > 300){

          throw new Error("Título demasiado grande")

        }

        note.title = this.auxTitulo

        note.content = this.auxDescripcion

        note.categories = this.noteCategories

        await NoteRepository.save(note);

        this.$router.push("/notes")

      }catch(e){

        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }

      }
    }

    
  },

  mounted() {

    this.fetchCategories();

    
  }

};
</script>

<style>

.deleteButton{

  float: right;
  margin-right: 15px;
  border-radius: 5px;
  border: none;
  color: #ececec;
  background-color: #252525;

}

.deleteButton:hover{

  background-color: #353535;

}



.listaCats{

  list-style-type: none;  
  text-align: start;

}

.subListaCats{

  text-align: start;
  list-style-type: none; 
  color: #ececec;

}

.selectCat{

  width: 60%;
  height: 60%;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 10px;
  background-color: #161616;
  color: #ececec;
  text-transform: capitalize;
  transition:all;
  transition-duration: 200ms;

}

.selectCat:hover {
  
  background-color: #353535;

}

.noteFormBox{

  border-radius: 5px;
  border: 1px solid #78797c;
  min-width: 21vw;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  padding: 20px;
  background-color: #252525

}

.loginCat{
  
  display: flex;
  flex-direction: row;

}


.categoriasBox{

  display: flex;

  flex-direction: column;

}

.categoriasText{
  
  text-align: start;
  color: #ececec;
  margin-bottom: 5px;


}



.addButton{

  margin-left: 40px;
  width: 90%;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 5px 0px;
  background-color: #161616;
  color: #ececec;
  text-transform: capitalize;
  transition:all;
  transition-duration: 200ms;
  margin-top: 3px;

}

.addButton:hover {
  
  background-color: #353535;

}


</style>