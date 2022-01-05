<template>
  <v-card height="100%" :dark="darkmode">
    <v-layout column justify-space-between fill-height>
      <v-layout column>
        <v-flex xs2>
          <v-col cols="12">
            <v-img
              :src="require('../assets/trek-logo.svg')"
              class="my-3"
              contain
              height="100"
            />
          </v-col>
        </v-flex>
        <v-flex xs1 class="ma-3">
          <search-location
            placeholder="Origin"
            @change="_handleOriginChange"
            :disabled="loadingRoute"
          />
        </v-flex>
        <v-flex xs1 class="mt-3 mr-3 ml-3">
          <search-location
            placeholder="Destination"
            @change="_handleDestinationChange"
            :disabled="loadingRoute"
          />
        </v-flex>
        <!--
        <v-flex xs1 class="ma-0">
          <v-layout justify-center>
            <v-progress-circular
              class="ma-2"
              :width="3"
              v-if="loadingRoute"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-layout>
        </v-flex>
        -->
        <v-flex xs1 class="ma-3">
          <via-routes />
        </v-flex>
      </v-layout>
      <v-layout column justify-end align-end>
        <v-flex xs1>
          <v-layout size="2">
            <v-icon small class="ma-2" v-if="darkmode">
              mdi-weather-night
            </v-icon>
            <v-icon small class="ma-2" v-if="!darkmode">
              mdi-weather-sunny
            </v-icon>
            <v-switch v-model="darkmode" inset dense> </v-switch>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-card>
</template>

<script>
import SearchLocation from "./SearchLocation.vue";
import ViaRoutes from "./ViaRoutes.vue";

export default {
  components: { SearchLocation, ViaRoutes },
  data() {
    return {};
  },
  methods: {
    _handleOriginChange(e) {
      if (!e) return;
      this.$store.commit("SET_ORIGIN", [e.longitude, e.latitude]);
      this.$store.dispatch("LOAD_ROUTE");
    },
    _handleDestinationChange(e) {
      if (!e) return;
      this.$store.commit("SET_DESTINATION", [e.longitude, e.latitude]);
      this.$store.dispatch("LOAD_ROUTE");
    },
  },
  computed: {
    darkmode: {
      set(val) {
        this.$store.commit("SET_DARKMODE", val);
      },
      get() {
        return this.$store.state.darkmode;
      },
    },
    loadingRoute() {
      return this.$store.state.loadingRoute;
    },
  },
};
</script>

<style>
</style>