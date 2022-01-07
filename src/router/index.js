import Vue from "vue";
import VueRouter from "vue-router";
import TrekMap from "../views/TrekMap.vue";
import TrekLogin from "../views/TrekLogin.vue";
import TrekRedirect from "../views/TrekRedirect.vue";
import TrekUser from "../views/TrekUser.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "TrekMap",
    component: TrekMap,
  },
  {
    path: "/login",
    name: "TrekLogin",
    component: TrekLogin,
  },
  {
    path: "/redirect",
    name: "TrekRedirect",
    component: TrekRedirect,
  },
  {
    path: "/me",
    name: "TrekUser",
    component: TrekUser,
  },

];

const router = new VueRouter({
  base: "/trek",
  routes
});

export default router;
