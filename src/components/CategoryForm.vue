<template>

    <div>
        <h1 class="title mt-4 mb-3">Añadir Categoría</h1>
    </div>

    <div class="categoryListBox">
        <div class="normalDiv mb-4">
            <label class="loginText mt-1 mb-2" for="name">Nombre de la categoría  </label>
            <input class="inputClass" placeholder="Inserte el nombre de la categoría" type="text" id="name" v-model="name"/>
        </div>
        <div>
            <button v-if="category.id == null" class="addCategoryButton mt-1 mb-2" @click="addCategory()"> Añadir</button>
            <button v-if="category.id != null" class="addCategoryButton mt-1 mb-2" @click="editCategory()"> Editar</button>
        </div>


    </div>

</template>

<script>
import CategoryRepository from "../repositories/CategoryRepository.js";
export default{

    data(){

        return{

            name: '',
            category: {},

        }

    },

    methods:{

        async addCategory(){

            this.category.name = this.name;
            await CategoryRepository.create(this.category);
            this.$router.push("/categories")

        },        
        
        async editCategory(){

            this.category.name = this.name;
            await CategoryRepository.update(this.category);
            this.$router.push("/categories")

        }

    },

    async mounted(){

        if(this.$route.params.categoryId != null){

            const id = this.$route.params.categoryId

            this.category = await CategoryRepository.findOne(id);

            this.name = this.category.name

        }
 

    }

}


</script>

<style>

.addCategoryButton{

width: 60%;
max-width: 100%;
border-radius: 5px;
border: 1px solid #78797c;
padding: 5px 20px;
background-color: #161616;
color: #ececec;
text-transform: capitalize;
transition:all;
transition-duration: 200ms;
margin-top: -10px;

}

.addCategoryButton:hover {

background-color: #353535;

}

.normalDiv{

    display: flex;
    flex-direction: column;
    
}

.categoryListBox {

    display: flex;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid #78797c;
    min-width: 650px;
    max-width: 32vw;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    padding: 20px;
    background-color: #252525

}

</style>