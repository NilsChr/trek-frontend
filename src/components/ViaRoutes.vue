<template>
  <v-layout column align-center id="destination-list">

    <v-flex xs1 class="ml-1 mr-1 mt-0 mb-0" style="width: 90%">
      <v-layout>
        <search-location placeholder="Origin" :disabled="originIsFixed || loadingRoute" :isOrigin="true" :index="0" />
      </v-layout>
      <v-layout justify-center>
        <v-btn class="mt-2 mb-2 adder mr-6" fab x-small color="primary lighten-2" :plain="!originIsSkip"
          :elevation="1" @click="toggleSkipOrigin()">
          <v-icon> mdi-airplane </v-icon>
        </v-btn>
        <v-btn class="mt-2 mb-2 adder" fab x-small color="grey lighten-4" plain :elevation="1" @click="addBox(0)"
          :dark="darkmode">
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-layout>
    </v-flex>

    <v-flex xs1 class="ml-1 mr-1 mt-0 mb-0" v-for="(item, i) in viaList" :key="item.id" style="width: 90%">
      <v-layout>
        <search-location placeholder="Via" :disabled="loadingRoute" :index="i" />
        <v-btn class="ma-0 mt-3 deleter" fab x-small color="grey lighten-4" plain :elevation="1" @click="removeBox(i)"
          :dark="darkmode">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-layout>
      <v-layout justify-center>
        <v-btn class="mt-2 mb-2 adder mr-6" fab x-small color="primary lighten-2" :plain="!viaList[i].skip"
          :elevation="1" @click="toggleSkipVia(i)">
          <v-icon> mdi-airplane </v-icon>
        </v-btn>
        <v-btn class="mt-2 mb-2 adder" fab x-small color="grey lighten-4" plain :elevation="1" @click="addBox(i + 1)"
          :dark="darkmode">
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-layout>
    </v-flex>


    <v-flex xs1 class="ml-1 mr-1 mt-0 mb-0" style="width: 90%">
      <v-layout>
        <search-location placeholder="Destination" :disabled="loadingRoute" :isDestination="true" />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import SearchLocation from "./SearchLocation.vue";

export default {
  components: { SearchLocation },
  data() {
    return {
      ids: 1,
      searchInterval: null,
      isLoading: false,
    };
  },
  methods: {
    addBox(index) {
      this.$store.dispatch("ADD_VIA_BOX", index)
    },
    removeBox(index) {
      this.$store.dispatch("REMOVE_VIA_BOX", index)
      this.$store.dispatch("LOAD_ROUTE");

    },
    toggleSkipOrigin() {
      this.$store.dispatch("TOGGLE_SKIP_ORGIN")
      this.$store.dispatch("LOAD_ROUTE");
    },
    toggleSkipVia(index) {
      this.$store.dispatch("TOGGLE_SKIP_VIA_SEGMENT", index)
      this.$store.dispatch("LOAD_ROUTE");
    }
  },
  computed: {
    viaList() {
      return this.$store.state.viaList;
    },
    originIsFixed() {
      return this.$store.state.origin.isFixed;
    },
    originIsSkip() {
      return this.$store.state.origin.skip;
    },
    loadingRoute() {
      return this.$store.state.loadingRoute;
    },
    darkmode() {
      return this.$store.state.darkmode;
    },
  },
};
</script>

<style>
#destination-list {
  max-height: 700px;
  overflow-y: scroll;
}

.adder {
  width: 1.8em !important;
  height: 1.8em !important;
  transition: all 0.5s ease;
}

.adder * {
  color: black !important;
}

.adder:hover {
  background-color: rgb(73, 138, 208);
  animation: bounce 0.2s;
  animation-fill-mode: forwards;
}

.adder:hover * {
  color: white;
}

.deleter {
  width: 1.8em !important;
  height: 1.8em !important;
  transition: all 0.5s ease;
}

.deleter * {
  color: black !important;
}

.deleter:hover {
  background-color: rgb(208, 73, 73);
  animation: bounce 0.2s;
  animation-fill-mode: forwards;
}

.deleter:hover * {
  color: white;
}

@keyframes bounce {
  0% {
    transform: scale(1, 1);
  }

  70% {
    transform: scale(1.4, 1.4);
  }

  100% {
    transform: scale(1.3, 1.3);
  }
}
</style>
