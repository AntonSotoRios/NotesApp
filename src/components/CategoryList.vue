<template>
    <div>
        <h1 class="title mt-4 mb-3">Lista de categorias</h1>
    </div>
    <div>

        <div class="categoryListBox">

            <router-link class="addCategoryListButton" :to="{ name: 'categoryCreate' }"> Add Category </router-link>

            <div class="divider"/>

            <li class="categoryList" v-for="(category, index) in categories" :key="category.id" > 

                <div>

                    <router-link class="categoryLogin" :to="{ name: 'notesByCategory', params: { categoryName: category.name }  }"> {{ category.name }}</router-link>
                    
                    <router-link class="categoryListButton" :to="{ name: 'categoryEdit', params: { categoryId: category.id} }"> Edit Category</router-link>

                    <button class="categoryListButton" @click="deleteCategory(index)"> Delete Category</button>

                </div>

                <div v-if="index < categories.length-1" class="divider"/>

            </li>

        </div>

    </div>

</template>

<script>

    import CategoryRepository from "../repositories/CategoryRepository.js";

    export default{

        data(){

            return{

                categories: [],

            }


        },

        methods:{

            async findCategories(){

                this.categories = await CategoryRepository.findAll();

            },

            async deleteCategory(index){

                var deleteId = this.categories[index].id

                await CategoryRepository.deleteCategory(deleteId);

                this.findCategories();

            }

        },

        async mounted(){

            this.findCategories();

        }


    }

</script>

<style>

.categoryList{

display: flex;
flex-direction: column;
justify-content: space-around;
list-style-type: none;
margin: 20px;
margin-bottom: 5px;

}

.categoryListBox {

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

.categoryLogin{

text-align: start;
color: #ececec;
margin-bottom: -5px;

}

.categoryListButton{

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
margin-top: -10px;

}

.categoryListButton:hover {

background-color: #353535;

}

.addCategoryListButton{

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

.addCategoryListButton:hover {

background-color: #353535;

}

</style>

