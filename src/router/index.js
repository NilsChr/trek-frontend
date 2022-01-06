import Vue from "vue";
import VueRouter from "vue-router";
import TrekMap from "../views/TrekMap.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "TrekMap",
    component: TrekMap,
  },
];

const router = new VueRouter({
  base: "/trek",
  routes
});

export default router;
