import { createRouter, createWebHistory } from "vue-router";
import UserList from "../components/UserList.vue";
import NoteList from "../components/NoteList.vue";
import CategoryList from "../components/CategoryList.vue";
import CategoryForm from "../components/CategoryForm.vue";
import NoteForm from "../components/NoteForm.vue";
import NoteListCategory from "../components/NoteListCategory.vue";
import NoteDetail from "../components/NoteDetail.vue";
import ErrorNotFoundView from "../views/ErrorNotFoundView.vue";
import LoginForm from "../components/LoginForm.vue";

import auth from "@/common/auth";
import { getStore } from "@/common/store";
import RegisterForm from "@/components/RegisterForm.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginForm,
    meta: { public: true, isLoginPage: true }
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterForm,
    meta: {public: true}
  },
  {
    path: "/users",
    name: "users",
    component: UserList,
  },
  {
    path: "/categories",
    name: "categories",
    component: CategoryList,
  },  
  {
    path: "/category/new",
    name: "categoryCreate",
    component: CategoryForm,
  },  
  {
    path: "/category/:categoryId",
    name: "categoryEdit",
    component: CategoryForm,
  },
  {
    path: "/notes/category/:categoryName",
    name: "notesByCategory",
    component: NoteListCategory,
  },
  {
    path: "/notes/user/:userName",
    name: "notesByUser",
    component: NoteList
  },
  {
    path: "/notes",
    name: "NoteList",
    component: NoteList
  },
  // /notes/new debe colocarse antes de /notes/:id porque si no vue-router
  // interpreta "new" como si fuera el id.
  //
  // Una forma de evitar este problema es usar una expresión regular para
  // limitar los valores que son interpretados. Por ejemplo, usando el path
  // /notes/:id(\\d+), vue-router espera que :id sea numérico.
  {
    path: "/notes/new",
    name: "NoteCreate",
    component: NoteForm
  },
  {
    path: "/notes/:noteId/edit",
    name: "NoteDetailEdit",
    component: NoteDetail
  },
  {
    path: "/notes/:noteId",
    name: "NoteDetail",
    component: NoteDetail
  },
  {
    path: "/notes/:noteId/edit",
    name: "NoteEdit",
    component: NoteForm
  },
  {
    path: "/:catchAll(.*)*",
    component: ErrorNotFoundView,
    meta: { public: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // Lo primero que hacemos antes de cargar ninguna ruta es comprobar si
  // el usuario está autenticado (revisando el token)
  auth.isAuthenticationChecked.finally(() => {
    // por defecto, el usuario debe estar autenticado para acceder a las rutas
    const requiresAuth = !to.meta.public;

    const requiredAuthority = to.meta.authority;
    const userIsLogged = getStore().state.user.logged;
    const loggedUserAuthority = getStore().state.user.authority;

    if (requiresAuth) {
      // página privada
      if (userIsLogged) {
        if (requiredAuthority && requiredAuthority != loggedUserAuthority) {
          // usuario logueado pero sin permisos suficientes, le redirigimos a la página de login
          alert("Acceso prohibido para el usuario actual; intenta autenticarte de nuevo");
          auth.logout();
          next("/");
        } else {
          // usuario logueado y con permisos adecuados
          next();
        }
      } else {
        // usuario no está logueado, no puede acceder a la página
        alert("Esta página requiere autenticación");
        next("/");
      }
    } else {
      // página pública
      if (userIsLogged && to.meta.isLoginPage) {
        // si estamos logueados no hace falta volver a mostrar el login
        next({ name: "NoteList", replace: true });
      } else {
        next();
      }
    }
  });
});

export default router;
