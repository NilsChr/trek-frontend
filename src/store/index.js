import Vue from "vue";
import Vuex from "vuex";
import polyline from '@mapbox/polyline';

import TREK_API from "../services/trekApi";

Vue.use(Vuex);

let ids = 0

function blankLocation() {
  return { value: null, lat: null, lng: null, skip: false, id: ids++ }
}
export default new Vuex.Store({
  state: {
    darkmode: false,
    trekApiToken: null,
    origin: blankLocation(),
    destination: blankLocation(),
    route: null,
    loadingRoute: false,
    bbox: null,
    distance: 0,
    viaList: [],
    trekIsActive: null,
    loadingLegs: false,
    finishedLegs: [],
    userTreks: [],
    error: null,
  },
  getters: {},
  mutations: {
    SET_DARKMODE(state, darkmode) {
      state.darkmode = darkmode;
    },
    SET_TREK_API_TOKEN(state, token) {
      state.trekApiToken = token;
    },
    SET_ORIGIN(state, item) {
      state.origin = item
    },
    SET_DESTINATION(state, item) {
      const destination = item ?
        { lat: item.lat, lng: item.lng, value: item.value, id: ids++ }
        : blankLocation()
      state.destination = destination
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
    SET_LOADING_LEGS(state, loadingLegs) {
      state.loadingLegs = loadingLegs;
    },
    SET_TREK_IS_ACTIVE(state, trekIsActive) {
      state.trekIsActive = trekIsActive;
    },
    ADD_FINISHED_LEG(state, finishedLeg) {
      state.finishedLegs.push(finishedLeg);
    },
    SET_USER_TREKS(state, userTreks) {
      state.userTreks = userTreks;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    CHANGE_ORIGIN({commit, state}, item) {
      const oldOrigin = state.origin ? state.origin : blankLocation()
      const newData = item ? item : blankLocation()
      // console.log("oldOrigin", JSON.stringify(oldOrigin))
      // console.log("newData", JSON.stringify(newData))
      let newOrigin = Object.assign(oldOrigin, newData);
      // have to assign new id like this for vue to pick up change
      newOrigin = { ...newOrigin, id: ids++ }
      // console.log("newOrigin", JSON.stringify(newOrigin))
      commit("SET_ORIGIN", newOrigin)
    },
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
      const route = {
        polyline: res.data.route.polyline,
        geojson: { type: 'geojson', data: polyline.toGeoJSON(res.data.route.polyline) }
      }
      let b = [
        [res.data.route.bbox[0], res.data.route.bbox[1]],
        [res.data.route.bbox[2], res.data.route.bbox[3]]]
        ;
      commit("SET_BBOX", b);
      let distance = res.data?.route?.distance || 0;

      console.log("distance", distance)
      commit("SET_DISTANCE", distance);
      commit("SET_ROUTE", route);
      commit("SET_LOADING_ROUTE", false);
    },
    ADD_VIA_BOX({ commit, state }, index) {
      const viaList = JSON.parse(JSON.stringify(state.viaList))
      viaList.splice(index, 0, blankLocation());
      commit("SET_VIA_LIST", viaList)
    },
    REMOVE_VIA_BOX({ commit, state }, index) {
      const viaList = state.viaList
      viaList.splice(index, 1);
      commit("SET_VIA_LIST", viaList)
    },
    SET_VIA_BOX({ commit, state }, { index, item }) {
      if (!item) {
        return
      }
      const viaList = JSON.parse(JSON.stringify(state.viaList))
      let oldVal = viaList[index]
      let newVal = item ?
        {
          ...oldVal,
          lat: item.lat,
          lng: item.lng,
          value: item.value,
          id: ids++
        } : null
      viaList[index] = newVal
      commit("SET_VIA_LIST", viaList)
    },

    async LOAD_LEG({ commit, state }, { trekId, legId }) {
      commit("SET_LOADING_LEGS", true);
      await TREK_API.getLegData(trekId, legId)
        .then(legData => {
          if (legData.polyline) {
            commit("ADD_FINISHED_LEG", legData)
          }
        })
        .catch(e => commit("SET_LOADING_LEGS", false))
      commit("SET_LOADING_LEGS", false)
    },
    TOGGLE_SKIP_ORGIN({ commit, state }) {
      const origin = JSON.parse(JSON.stringify(state.origin))
      origin.skip = !origin.skip
      commit("SET_ORIGIN", origin)
    },
    TOGGLE_SKIP_VIA_SEGMENT({ commit, state }, index) {
      const viaList = JSON.parse(JSON.stringify(state.viaList))
      viaList[index].skip = !viaList[index].skip
      commit("SET_VIA_LIST", viaList)
    }
  },
  modules: {},
});
