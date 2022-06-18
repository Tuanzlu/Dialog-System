import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    // 首页
    path: "/",
    name: "index",
    component: () => import("../views/Index.vue"),
  },
  {
    // FAQ问答管理-应用列表
    path: "/faq",
    name: "faq",
    component: () => import("../views/Faq.vue"),
  },
  {
    // 问答列表
    path: "/faqdetail/:id",
    name: "faqdetail",
    component: () => import("../views/FaqDetail.vue"),
  },
  {
    // 多轮对话-流程管理
    path: "/multidialog/:id",
    name: "multidialog",
    component: () => import("../views/MultiDialog.vue"),
  },
  {
    // 在线聊天机器人
    path: "/robot",
    name: "robot",
    component: () => import("../views/Robot.vue"),
  },
  {
    // 用户登录 未启用
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    // 在线对话标注
    path: "/tag",
    name: "tag",
    component: () => import("../views/Tag.vue"),
  },
  {
    // 平台使用说明
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
