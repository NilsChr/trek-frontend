import Vue from "vue";
import VueRouter from "vue-router";
import TrekNew from "../views/TrekNew.vue";
import TrekLogin from "../views/TrekLogin.vue";
import TrekProgress from "../views/TrekProgress.vue";
import TrekRedirect from "../views/TrekRedirect.vue";
import TrekJoin from "../views/TrekJoin.vue";
import TrekUser from "../views/TrekUser.vue";
import TREK_API from "../services/trekApi";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "TrekNew",
    component: TrekNew,
  },
  {
    path: "/login",
    name: "TrekLogin",
    component: TrekLogin,
    props: route => (
      { targetUrl: route.query.targetUrl }
    )
  },
  {
    path: "/redirect",
    name: "TrekRedirect",
    component: TrekRedirect,
    props: route => (
      { targetUrl: route.query.targetUrl }
    )
  },
  {
    path: "/user",
    name: "TrekUser",
    component: TrekUser,
  },
  {
    path: "/join/:inviteId",
    name: "TrekJoin",
    component: TrekJoin,
    props: true
  },
  {
    path: "/trek/:id",
    name: "TrekProgress",
    component: TrekProgress,
    props: true
  },
  {
    path: "*",
    name: "404",
    component: {
      template: '<p>Page Not Found</p>'
    }
  },

];

const router = new VueRouter({
  //base: process.env.NODE_ENV === "development" ? "" : "/trek",
  routes
});

let unprotectedRoutes = new Set(['TrekLogin', "TrekRedirect"])

router.beforeEach(async (to, from, next) => {
  if (!unprotectedRoutes.has(to.name)) {
    let isAuthenticated = await TREK_API.isAuthenticated();
    if (!isAuthenticated) {
      console.log("redirect to login")
      let targetUrl = window.location.origin + window.location.pathname + "#" + to.fullPath
      console.log("tohash", to)
      return next({ name: 'TrekLogin', query: { targetUrl: targetUrl } })
    }
  }
  console.log("continue", to)
  next()
})

export default router;
