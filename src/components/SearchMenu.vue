<template>
  <v-card height="100%" :dark="darkmode">
    <v-layout column justify-space-between fill-height>
      <v-layout column>
        <v-flex xs2>
          <v-col cols="12">
            <v-img
              v-if="!darkmode"
              :src="require('../assets/trek-logo.svg')"
              class="my-3"
              contain
              height="100"
            />
            <v-img
              v-if="darkmode"
              :src="require('../assets/trek-logo-dark.svg')"
              class="my-3"
              contain
              height="100"
            />
          </v-col>
        </v-flex>
        <via-routes/>
      </v-layout>

      <v-layout column justify-end align-end>
        <v-flex xs2>
          <error-500 v-if="error" />
        </v-flex>
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
import Error500 from "./error500.vue";
import SearchLocation from "./SearchLocation.vue";
import ViaRoutes from "./ViaRoutes.vue";

export default {
  components: { SearchLocation, ViaRoutes, Error500 },
  computed: {
    darkmode: {
      set(val) {
        this.$store.commit("SET_DARKMODE", val);
      },
      get() {
        return this.$store.state.darkmode;
      },
    },
    error() {
      return this.$store.state.error;
    },
  },
};
</script>

<style>
</style>
