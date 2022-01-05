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
  ></v-autocomplete>
</template>

<script>
import axios from "axios";

export default {
  props: ["placeholder", "disabled", "model"],
  data() {
    return {
      searchInterval: null,
      items: [],
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      /*model: null,*/
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
        let res = await axios.get(
          "http://localhost:3000/search/" + that.search
        );
        that.isLoading = false;
        that.items = res.data.locations;
      }, 300);
    },
    value(val) {
      this.$emit("change", val);
    }
  },
};
</script>

<style>
</style>