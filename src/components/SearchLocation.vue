<template>
  <v-autocomplete
    :dark="darkmode"
    outlined
    dense
    hide-details
    v-model="value"
    :items="items"
    :search-input.sync="search"
    :loading="isLoading"
    hide-no-data
    hide-selected
    item-text="name"
    :placeholder="placeholder"
    return-object
    :disabled="disabled"
    full-width
    class="search-loader"
  ></v-autocomplete>
</template>

<script>
import axios from "axios";
import TREK_API from "../services/trekApi";

export default {
  props: ["placeholder", "disabled", "model"],
  data() {
    return {
      searchInterval: null,
      items: [],
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      value: null,
      search: null,
    };
  },
  methods: {},
  computed: {
    darkmode() {
      return this.$store.state.darkmode;
    },
  },
  created() {
    this.value = this.model;
  },
  watch: {
    async search(val) {
      if (val == "") return;
      let that = this;
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(async function () {
        that.isLoading = true;
        if (that.search == "") return;
        that.items = await TREK_API.getLocations(that.search);
        that.isLoading = false;
      }, 300);
    },
    value(val) {
      this.$emit("change", val);
    },
  },
};
</script>

<style scoped>
.search-loader {
  font-size: 0.7em;
}
</style>