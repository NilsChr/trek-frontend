<template>
  <div id="map-container"></div>
</template>

<script>
import Mapbox from "mapbox-gl";

export default {
  data() {
    return {
      map: null,
      styleLight: "mapbox://styles/mapbox/streets-v11",
      styleDark: "mapbox://styles/mapbox/dark-v10",
      originMarker: null,
      destinationMarker: null,
    };
  },
  methods: {
    async initMap() {
      let style = this.styleLight;
      if (this.darkmode) {
        style = this.styleDark;
      }
      let that = this;
      return new Promise((resolve) => {
        that.map = new Mapbox.Map({
          container: "map-container",
          style: style,
          center: [0, 0],
          zoom: 2,
        });
        that.map.on("load", function () {
          resolve();
        });
      });
    },
    setOriginMarker() {
      this.originMarker = new Mapbox.Marker({
        color: "#befbeb",
        draggable: true,
      })
        .setLngLat([this.origin[0], this.origin[1]])
        .addTo(this.map);
    },
    setDestinationMarker() {
      this.destinationMarker = new Mapbox.Marker({
        color: "#f23f5a",
        draggable: true,
      })
        .setLngLat([this.destination[0], this.destination[1]])
        .addTo(this.map);
    },
    clearRoute() {
      const source = this.map.getSource("route");
      if (source) {
        this.map.removeLayer("route");
        this.map.removeSource("route");
      }
    },
    buildRoute() {
      this.clearRoute();
      if (!this.route) return;
      this.map.addSource("route", this.route);
      this.map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 3,
        },
      });
    },
    panToRoute() {
      if (!this.bbox) return;
      this.map.fitBounds(this.bbox, {
        padding: { top: 100, bottom: 50, left: 350, right: 150 },
      });
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
    origin() {
      if (this.originMarker) {
        this.originMarker.remove();
      }
      this.clearRoute();
      this.setOriginMarker();
    },
    destination() {
      if (this.destinationMarker) {
        this.destinationMarker.remove();
      }
      this.clearRoute();
      this.setDestinationMarker();
    },
    async darkmode() {
      this.map.remove();
      await this.initMap();
      this.setOriginMarker();
      this.setDestinationMarker();
      this.buildRoute();
      this.panToRoute();
    },
    route() {
      this.clearRoute();
      this.buildRoute();
      this.panToRoute();
    },
  },
  mounted() {
    Mapbox.accessToken =
      "pk.eyJ1Ijoibmlsc2NociIsImEiOiJja3kwZGJoa3QwMGtlMm9udjRod2Zocm10In0.Zinp_gFu9BXjcLi4vwWH_Q";
    this.initMap();
  },
};
</script>

<style>
#map-container {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>