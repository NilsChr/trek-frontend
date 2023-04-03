<template>
  <div>


    <v-menu v-model="showMenu" :position-x="menuX" :position-y="menuY" absolute offset-y>
      <v-list>
        <v-list-item v-if="!originIsFixed" @click="addCtxStart">
          <v-list-item-title>Set as origin</v-list-item-title>
        </v-list-item>
        <v-list-item @click="addCtxVia">
          <v-list-item-title>Via</v-list-item-title>
        </v-list-item>
        <v-list-item @click="addCtxDestination">
          <v-list-item-title>Set as destination</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <div id="map-container"></div>
  </div>
</template>

<script>
import Mapbox from "mapbox-gl";
import polyline from '@mapbox/polyline';
import Vue from 'vue'

const LINE_STYLE = {
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#888",
    "line-width": 3,
  },
}

function zoomToPoint(map, lng, lat) {
  map.flyTo({
    center: [lng, lat],
    zoom: 8,
    duration: 1000,
    essential: true // This animation is considered essential with
    //respect to prefers-reduced-motion
  });

}

function nameForLatLng(lat, lng) {
  return `${lat.toFixed(2)}, ${lng.toFixed(2)}`
}

export default {
  props: {
    addContextMenu: { type: Boolean, default: true }
  },
  data() {
    return {
      showMenu: false,
      menuX: 0,
      menuY: 0,
      map: null,
      styleLight: "mapbox://styles/mapbox/streets-v11",
      styleDark: "mapbox://styles/mapbox/dark-v10",
      originMarker: null,
      destinationMarker: null,
      viaMarkers: [],
      legsInMap: new Set(),
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
        // disable map rotation using right click + drag
        that.map.dragRotate.disable();
        // disable map rotation using touch rotation gesture
        that.map.touchZoomRotate.disableRotation();

        that.map.on("load", function () {
          resolve();
        });
        if (this.addContextMenu) {
          that.map.on('contextmenu', function (e) {
            e.preventDefault()
            that.menuX = e.point.x
            that.menuY = e.point.y
            that.menuItem = {
              lat: e.lngLat.lat,
              lng: e.lngLat.lng,
              value: nameForLatLng(e.lngLat.lat, e.lngLat.lng)
            }
            Vue.nextTick(() => {
              that.showMenu = true
            })
          });
        }
      });
    },
    setOriginMarker() {
      if (this.origin.value === null) return;
      console.log(this.origin.value)
      const marker = new Mapbox.Marker({
        color: "#befbeb",
        draggable: !this.originIsFixed,
      })
        .setLngLat([this.origin.lng, this.origin.lat])
        .addTo(this.map);
      marker.on("dragend", () => {
        const { lng, lat } = marker.getLngLat();
        const item = {
          lat: lat,
          lng: lng,
          value: nameForLatLng(lat, lng)
        }
        this.$store.dispatch("CHANGE_ORIGIN", item);
        this.$store.dispatch("LOAD_ROUTE");
      })
      zoomToPoint(this.map, this.origin.lng, this.origin.lat)
      this.originMarker = marker
    },
    setDestinationMarker() {
      if (this.destination.value === null) return;

      const marker = new Mapbox.Marker({
        color: "#f23f5a",
        draggable: true,
      })
        .setLngLat([this.destination.lng, this.destination.lat])
        .addTo(this.map);
      marker.on("dragend", () => {
        const { lng, lat } = marker.getLngLat();
        const item = {
          lat: lat,
          lng: lng,
          value: nameForLatLng(lat, lng)
        }
        this.$store.commit("SET_DESTINATION", item);
        this.$store.dispatch("LOAD_ROUTE");
      })
      zoomToPoint(this.map, this.destination.lng, this.destination.lat)
      this.destinationMarker = marker
    },
    setViaMarkers() {
      const markers = []
      this.viaList.forEach((point, i) => {
        if (point.value === null) {
          return
        }
        const marker = new Mapbox.Marker({
          color: "#888",
          draggable: true,
        })
          .setLngLat([point.lng, point.lat])
          .addTo(this.map);
        marker.on("dragend", () => {
          const { lng, lat } = marker.getLngLat();
          const item = {
            lat: lat,
            lng: lng,
            value: nameForLatLng(lat, lng)
          }
          this.$store.dispatch("SET_VIA_BOX", { index: i, item: item })
          this.$store.dispatch("LOAD_ROUTE");
        })
        markers.push(marker)
      })
      this.viaMarkers = markers
    },
    addCtxStart() {
      this.$store.dispatch("CHANGE_ORIGIN", this.menuItem);
      this.$store.dispatch("LOAD_ROUTE");

    },
    addCtxVia() {
      const index = this.$store.state.viaList.length
      this.$store.dispatch("ADD_VIA_BOX", index)
      this.$store.dispatch("SET_VIA_BOX", { index: index, item: this.menuItem })
      this.$store.dispatch("LOAD_ROUTE");
    },
    addCtxDestination() {
      this.$store.commit("SET_DESTINATION", this.menuItem);
      this.$store.dispatch("LOAD_ROUTE");

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
      this.map.addSource("route", this.route.geojson);
      this.map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        ...LINE_STYLE
      });
    },
    panToRoute() {
      if (!this.bbox) return;
      this.map.fitBounds(this.bbox, {
        padding: { top: 100, bottom: 50, left: 350, right: 150 },
      });
    },
    addFinishedLegs() {
      this.finishedLegs.forEach(leg => {
        const geojson = polyline.toGeoJSON(leg.polyline);
        console.log("polyline", { type: 'geojson', data: geojson })
        if (this.legsInMap.has(leg.leg.id)) {
          return
        }
        this.legsInMap.add(leg.leg.id)
        this.map.on("load", () => {
          this.map.addSource(leg.leg.id, { type: 'geojson', data: geojson });
          this.map.addLayer({
            id: leg.leg.id + "layer",
            type: 'line',
            source: leg.leg.id,
            ...LINE_STYLE
          });
          new Mapbox.Marker({ color: "#888", draggable: false })
            .setLngLat([leg.start.lon, leg.start.lat])
            .addTo(this.map);
        });
      })
    }
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
    finishedLegs() {
      return this.$store.state.finishedLegs;
    },
    originIsFixed() {
      return this.$store.state.origin.isFixed;
    },
    viaList() {
      return this.$store.state.viaList;
    },
  },
  watch: {
    origin() {
      if (this.originMarker) {
        this.originMarker.remove();
      }
      console.log("origin watch")
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
    finishedLegs() {
      this.addFinishedLegs()
    },
    viaList() {
      this.viaMarkers.forEach(marker => marker.remove())
      this.clearRoute();
      this.setViaMarkers()
    }
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
