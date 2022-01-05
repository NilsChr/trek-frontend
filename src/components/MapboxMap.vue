<template>
  <MglMap :accessToken="accessToken" :mapStyle="style" @load="onMapLoaded">
    <MglMarker :coordinates="origin" color="cyan" />
    <MglMarker :coordinates="destination" color="cyan" />

    <MglGeojsonLayer
      v-if="route && route.data"
      :sourceId="mSourceId"
      :source="route"
      layerId="mLayerId"
      :layer="mLayer"
    />
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker, MglGeojsonLayer } from "vue-mapbox";

export default {
  components: {
    MglMap,
    MglMarker,
    MglGeojsonLayer,
  },
  data() {
    return {
      accessToken:
        "pk.eyJ1Ijoibmlsc2NociIsImEiOiJja3kwZGJoa3QwMGtlMm9udjRod2Zocm10In0.Zinp_gFu9BXjcLi4vwWH_Q",
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      mapStyleDark: "mapbox://styles/mapbox/dark-v10",
      style: "mapbox://styles/mapbox/streets-v11",

      mSourceId: "route",
      mSource: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      },
      mLayerId: "route",
      mLayer: {
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 8,
        },
      },
    };
  },
  methods: {
    onMapLoaded(event) {
      this.map = event.map;
    },
  },
  computed: {
    origin() {
      return this.$store.state.origin;
    },
    destination() {
      return this.$store.state.destination;
    },
    darkmode() {
      return this.$store.state.darkmode;
    },
    route() {
      return this.$store.state.route;
    },
    bbox() {
      return this.$store.state.bbox;
    },
  },
  watch: {
    darkmode(val) {
      //if (this.darkMode) this.style = this.mapStyleDark;
      //else this.style = this.mapStyle;
    },
    route() {
      this.map.fitBounds(this.bbox, {
        padding: { top: 100, bottom: 250, left: 250, right: 50 },
      });
    },
  },
  created() {
    this.style = this.mapStyle;
    this.mapbox = Mapbox;
  },
};
</script>

<style>
</style>