import Vue from "vue";
import Vuex from "vuex";
import TREK_API from "../services/trekApi";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    darkmode: false,
    origin: [0, 0],
    destination: [0, 0],
    route: null,
    loadingRoute: false,
    bbox: null,
    distance: 0,
    viaList: [],
    error: null,
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
    SET_VIA_LIST(state, viaList) {
      state.viaList = viaList;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async LOAD_ROUTE({ commit, state }) {
      commit("SET_LOADING_ROUTE", true);
      let res;
      try {
        res = await TREK_API.getRoute();
      } catch (e) {
        commit("SET_LOADING_ROUTE", false);
        return;
      }

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
