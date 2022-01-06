<template>
  <v-layout column align-center id="destination-list">
    <v-flex
      xs1
      class="ml-1 mr-1 mt-0 mb-0"
      v-for="(item, i) in list"
      :key="item.id"
      style="width: 90%"
    >
      <v-layout v-if="!item.isAdder">
        <search-location
          :placeholder="item.placeholder"
          @change="_handleChange($event, i)"
          :disabled="loadingRoute"
          :model="item.value"
        />
        <v-checkbox
          class="ma-0 ml-1 mt-1"
          v-if="i != 0 && i != list.length - 1"
          v-model="item.skip"
          @change="updateMap"
          dense
        >
        </v-checkbox>
        <v-btn
          class="ma-0 mt-3 deleter"
          fab
          x-small
          color="grey lighten-4"
          plain
          :elevation="1"
          @click="collapse(i)"
          :dark="darkmode"
          v-if="i != 0 && i != list.length - 1"
        >
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-layout>

      <v-layout v-if="item.isAdder" justify-center>
        <v-btn
          class="mt-2 mb-2 adder"
          fab
          x-small
          color="grey lighten-4"
          plain
          :elevation="1"
          @click="expand(i)"
          :dark="darkmode"
        >
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import SearchLocation from "./SearchLocation.vue";
import TREK_API from "../services/trekApi";

export default {
  components: { SearchLocation },
  data() {
    return {
      ids: 1,
      list: [],
      searchInterval: null,
      /*items: [],
      entries: [],*/
      isLoading: false,
      //value: null,
    };
  },
  methods: {
    getDestination(title = null, isAdder = false) {
      return {
        id: this.ids++,
        isAdder: isAdder,
        value: null,
        placeholder: title,
        search: "",
        items: [],
        skip: false,
      };
    },
    collapse(index) {
      this.list.splice(index, 1);
      this.list.splice(index, 1);
      this.updateMap();
    },
    expand(index) {
      this.list[index].isAdder = false;
      this.list[index].placeholder = "via";

      this.list.splice(index, 0, {
        id: this.ids++,
        isAdder: true,
        value: null,
      });
      this.list.splice(index + 2, 0, {
        id: this.ids++,
        isAdder: true,
        value: null,
      });
    },
    search(item) {
      if (item.search == "") return;
      let that = this;
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(async function () {
        that.isLoading = true;
        if (item.search == "") return;
        that.isLoading = false;
        item.items = await TREK_API.getLocations(item.search);
      }, 300);
    },
    updateMap() {
      let viaList = [];
      for (let i = 0; i < this.list.length - 1; i++) {
        if (i === 0) continue;
        if (this.list[i].isAdder) continue;
        let item = { ...this.list[i].value };
        item.skip = this.list[i].skip;
        viaList.push(item);
      }
      this.$store.commit("SET_VIA_LIST", viaList);
      this.$store.dispatch("LOAD_ROUTE");
    },
    _handleChange(event, i) {
      this.list[i].value = event;
      if (i == 0) {
        this.$store.commit("SET_ORIGIN", [event.longitude, event.latitude]);
      } else if (i == this.list.length - 1) {
        this.$store.commit("SET_DESTINATION", [
          event.longitude,
          event.latitude,
        ]);
      }
      this.updateMap();
    },
  },
  computed: {
    loadingRoute() {
      return this.$store.state.loadingRoute;
    },
    darkmode() {
      return this.$store.state.darkmode;
    },
  },
  created() {
    this.list.push(this.getDestination("Origin", false));
    this.list.push(this.getDestination("", true));
    this.list.push(this.getDestination("Destination", false));
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