import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/alunos/importar",
    name: "ImportarAlunos",
    component: () => import("../views/ImportarAlunos.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/alunos/:id",
    name: "DetalhesAluno",
    component: () => import("../views/DetalhesAluno.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (!requiresAuth && authStore.isAuthenticated && (to.path === "/login" || to.path === "/register")) {
    next("/");
  } else {
    next();
  }
});

export default router;
