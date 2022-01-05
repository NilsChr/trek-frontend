import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function longLatToParams(longLtd) {
  return longLtd[1] + "%2C%20" + longLtd[0];
}

export default new Vuex.Store({
  state: {
    darkmode: false,
    origin: [0, 0],
    destination: [0, 0],
    route: null,
    loadingRoute: false,
    bbox: null,
    distance: 0,
  },
  getters: {},
  mutations: {
    SET_DARKMODE(state, darkmode) {
      state.darkmode = darkmode;
    },
    SET_ORIGIN(state, origin) {
      state.origin = origin;
    },
    SET_DESTINATION(state, destination) {
      state.destination = destination;
    },
    SET_ROUTE(state, route) {
      state.route = route;
    },
    SET_LOADING_ROUTE(state, loadingRoute) {
      state.loadingRoute = loadingRoute;
    },
    SET_BBOX(state, bbox) {
      state.bbox = bbox;
    },
    SET_DISTANCE(state, distance) {
      state.distance = distance;
    },
  },
  actions: {
    async LOAD_ROUTE({ commit, state }) {
      commit("SET_LOADING_ROUTE", true);
      let parsed = [];
      parsed.push(["start", longLatToParams(state.origin)]);
      parsed.push(["stop", longLatToParams(state.destination)]);

      const params = new URLSearchParams([...parsed]);

      let res = await axios.get("http://localhost:3000/route/" + params);
      console.log(res);
      if (res.data.length === 0) {
        commit("SET_LOADING_ROUTE", false);

        return;
      }
      let route = {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: res.data.route.points,
        },
      };
      let b = [];

      b.push([res.data.route.bbox[0], res.data.route.bbox[1]]);
      b.push([res.data.route.bbox[3], res.data.route.bbox[4]]);
      commit("SET_BBOX", b);
      let distance = res.data?.route?.distance || 0;

      commit("SET_DISTANCE", distance);
      commit("SET_ROUTE", route);
      commit("SET_LOADING_ROUTE", false);
    },
  },
  modules: {},
});
