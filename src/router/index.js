import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("../views/Index.vue"),
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("../views/Faq.vue"),
  },
  {
    path: "/faqdetail/:id",
    name: "faqdetail",
    component: () => import("../views/FaqDetail.vue"),
  },
  {
    path: "/multidialog/:id",
    name: "multidialog",
    component: () => import("../views/MultiDialog.vue"),
  },
  {
    path: "/robot",
    name: "robot",
    component: () => import("../views/Robot.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/tag",
    name: "tag",
    component: () => import("../views/Tag.vue"),
  },
  {
    path: "/intro",
    name: "intro",
    component: () => import("../views/Intro.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
