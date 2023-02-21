<template>
  <v-container fluid fill-height class="pa-0 ma-0">
    <div id="map">
      <m-box />
    </div>

    <v-layout fill-height>
      <v-flex xs2 id="menu">
        <search-menu />
      </v-flex>
      <v-btn @click="onSave" fab large fixed right bottom color="primary" :disabled="!(route)">
        <v-icon>mdi-content-save-plus</v-icon>
      </v-btn>
      <bottom-navigation />
    </v-layout>
  </v-container>
</template>

<script>
import SearchMenu from "../components/SearchMenu.vue";
import MBox from "../components/MBox.vue";
import BottomNavigation from "../components/BottomNavigation"

import TREK_API from "../services/trekApi";

export default {
  components: { SearchMenu, MBox, BottomNavigation },
  name: "trek-map",
  data() {
    return {
      showMenu: true,
      menuX: 500,
      menuY: 500,
      width: 0,
      height: 0,
    };
  },
  computed: {
    darkmode() {
      return this.$store.state.darkmode;
    },
    error() {
      return this.$store.state.error;
    },
    route() {
      return this.$store.state.route;
    },
  },
  mounted() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
  methods: {
    onSave() {
      TREK_API.addTrek(this.route.polyline).then((res) => {
        this.$router.push({ name: "TrekProgress", params: { id: res.trekId } })
      }
      )
    },
  }
};
</script>

<style >
#menu {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 100%;
  height: 90%;
}
</style>
