<template>
  <v-container fluid fill-height class="pa-0 ma-0">
    <div id="map" :style="{ height: height + 'px', width: width + 'px' }">
      <m-box />
    </div>

    <v-layout fill-height>
      <v-flex xs2 id="menu">
        <search-menu />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SearchMenu from "../components/SearchMenu.vue";
import MBox from "../components/MBox.vue";

export default {
  components: { SearchMenu, MBox },
  name: "trek-map",
  data() {
    return {
      width: 0,
      height: 0,
    };
  },
  computed: {
    darkmode() {
      return this.$store.state.darkmode;
    },
  },
  mounted() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
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