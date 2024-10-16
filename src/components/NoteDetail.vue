<template>

  <div>

    <h1 class="titulo">Detalle de una nota</h1>

    <div v-if="this.note!=null" class="outerInfoBox">

      <div class="infoBox">

        <h5 class="infoText mt-3" for="login">Titulo  </h5>
        <h6 v-if="!this.edicion" class="infoText">&nbsp;&nbsp;{{ note.title }}</h6>
        <input v-else class="inputClassInfo" placeholder="Inserte el titulo" type="text" id="titulo" v-model="note.title"/>

        <h5 class="mt-3 infoText" for="login">Descripción </h5>
        <h6 v-if="this.note.content==null && !this.edicion" class="infoText">&nbsp;&nbsp; Esta nota no tiene contenido</h6>
        <h6 v-else-if="!this.edicion" class="infoText">&nbsp;&nbsp;{{ note.content }}</h6>
        <textarea v-else-if="this.edicion" class="inputClassInfo" placeholder="Inserte la descripción" type="text" id="descripcion" v-model="note.content"/>

        <h5 class="mt-3 infoText" for="login">Fecha </h5>
        <h6 class="infoText">&nbsp;&nbsp;
          {{ note.timestamp.toLocaleDateString() }} -
          {{ note.timestamp.toLocaleTimeString() }}
        </h6>
        
        <div style="display: flex; flex-direction: row;margin:auto;">
        <h5 class=" mt-3 loginText"> Archivada? &nbsp;</h5>
        <h6 v-if="this.note.archived" class="archivadaText"> Si</h6>
        <h6 v-else class="archivadaText"> No</h6>
        </div>

        <h5 class="mt-3 infoText" for="login">Categorias </h5>
        <div v-if="!this.edicion">
          
          <h6 v-if="categoriesAsString.length > 0" class="infoText">&nbsp;&nbsp; {{ categoriesAsString }}</h6>
          <h6 v-else class="infoText mb-4">&nbsp;&nbsp;Esta nota no tiene categorias</h6>

        </div>


        <div v-else class="categoriasBoxInfo mt-1">

          <div class="loginCatInfo">

            <select v-if="categories.length > 0" class="selectCatInfo" v-model="selectedCategory" name="categorias" id="categorias">
              <option v-for="category in categories" :key="category.id" :value="category">
              {{ category.name }}
              </option>
            </select>

            <div class="">
              <button v-if="categories.length > 0" class="addButtonInfo" @click="addCategory()">Add</button>
            </div>

          </div>



          <div class="mb-3 mt-1">
            <li class="mt-2 subListaCatsInfo" v-for="(category, index) in noteCategories" :key="category.id">
              - {{ category.name }}
              <button class="deleteButtonInfo" @click="deleteFromList(index)">X</button>
            </li>
          </div>

        </div>

        <div class="botonesEnFila">

          <button v-if="!this.edicion && !auth.isAdmin()" class="editButton" @click="editChange()"> Editar  </button>
          <button v-if="this.edicion && !auth.isAdmin()" class="editButton" @click="guardarNota()"> Guardar  </button>
          <button v-if="!auth.isAdmin() && note.archived==false" class="editButton" @click="archivarNota()"> Archivar  </button>
          <button v-if="!auth.isAdmin() && note.archived==true" class="editButton" @click="desarchivarNota()"> Desarchivar  </button>
          <button v-if="!auth.isAdmin()" class="editButton" @click="eliminarNota()"> Eliminar  </button>


        </div>


      </div>

    </div>

  </div>

</template>

<script>
import NoteRepository from "../repositories/NoteRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import Swal from 'sweetalert2'
import auth from "../common/auth.js";

export default {
  data() {
    return {
      note: null,
      categoriesAsString: null,
      edicion: false,
      categories: [],
      selectedCategory: {},
      noteCategories: [],
      auth,
    };
  },

  methods:{


    eliminarNota(){

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
      }).then((result) => {
        if (result.isConfirmed) {

          NoteRepository.delete(this.note.id)

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
          }).then((successResoult) => {

              if(successResoult.isConfirmed){

                this.$router.push("/notes")

              }

          });
        }
      });

    },

    async guardarNota(){

      try{

        if((this.note.title == null && this.note.content == null) || (this.note.title == '' && this.note.content == '')){

          throw new Error("Parámentros vacíos")

        }

        if(this.note.title.length > 300){

          throw new Error("Título demasiado grande")

        }

        this.note.categories = this.noteCategories

        await NoteRepository.save(this.note);

        this.$router.push("/notes")

        }catch(e){

        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }

      }
    },

    archivarNota(){

      this.note.archived = true;

      NoteRepository.save(this.note)

    },

    desarchivarNota(){

      this.note.archived = false;

      NoteRepository.save(this.note)

    },

    editChange(){

      this.edicion = true;

    },

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

  },

    async mounted(){

      await this.fetchCategories();

      this.note = await NoteRepository.findOne(this.$route.params.noteId);
      this.noteCategories = this.note.categories
      this.categories = this.categories.filter(item => !this.noteCategories.some(noteCat => noteCat.id === item.id));
      this.categoriesAsString = this.noteCategories?.map((t) => t.name).join(", ");

      if(this.$route.path.endsWith('/edit')){
        this.edicion = true;
      }

      }

  };

</script>

<style>

.alertPopup{

  border-radius: 20px;

}

.alertConfirm{

  background-color: #252525;
  border-radius: 5px;
  border: 1px solid #78797c;
  margin-right: 20px;

}

.alertCancel{

  color:#252525;
  background-color: #c8c7c7;
  border-radius: 5px;
  border: 1px solid #303132;
  margin-left: 20px;

}

.alertConfirm:hover{

  background-color: #161616;

}

.alertCancel:hover{

background-color: #fffefe;

}

.alertText{

  color:#ececec;

}

.archivadaText{

  text-align: start;
  color: #ececec;
  margin-top: 20px

}

.deleteButtonInfo{

float: right;
margin-right: 15px;
border-radius: 5px;
border: none;
color: #ececec;
background-color: #252525;

}

.deleteButtonInfo:hover{

background-color: #353535;

}

.listaCatsInfo{

list-style-type: none;  
text-align: start;

}

.subListaCatsInfo{
margin-left:10px;
justify-content: space-between;
text-align: start;
list-style-type: none; 
color: #ececec;

}

.selectCatInfo{

margin-top: 10px;
margin-left: 10px;
width: 40%;
height: 80%;
border-radius: 5px;
border: 1px solid #78797c;
padding: 10px 5px;
background-color: #161616;
color: #ececec;
text-transform: capitalize;
transition:all;
transition-duration: 200ms;

}

.selectCatInfo:hover {

background-color: #353535;

}

.noteFormBoxInfo{

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

.loginCatInfo{

margin-top: 5px;
justify-content: space-around;
display: flex;
flex-direction: row;

}


.categoriasBoxInfo{

display: flex;

flex-direction: column;

}

.categoriasTextInfo{

text-align: start;
color: #ececec;
margin-bottom: 5px;


}

.addButtonInfo{

margin-top: 13px;
width: 100%;
border-radius: 5px;
border: 1px solid #78797c;
padding: 5px 10px;
background-color: #161616;
color: #ececec;
text-transform: capitalize;
transition:all;
transition-duration: 200ms;

}

.addButtonInfo:hover {

background-color: #353535;

}

.inputClassInfo{

  margin:auto;
  background-color: #252525;
  color: #ececec;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 5px 10px;
  width: 55%;

}

.botonesEnFila{

  display:flex;
  flex-direction: row;
  margin: 10px;
  justify-content: space-around;

}

.editButton{
  
  width: 30%;
  border-radius: 5px;
  border: 1px solid #78797c;
  padding: 5px;
  background-color: #161616;
  color: #ececec;
  text-transform: capitalize;
  transition:all;
  transition-duration: 200ms;

}

.editButton:hover {

  background-color: #353535;

}

.infoBox{

  display: flex;
  flex-direction: column;
  width: 35%; margin: 0 auto;
  background-color: #252525;
  border-radius: 5px;
  border: 1px solid #78797c;
  min-width: 300px;
  
}

.infoText{

  color: #ececec;
  margin-bottom: 5px;

}


.outerInfoBox{

  display: flex;
  margin: 20px;

}

</style>