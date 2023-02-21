<template>
  <v-combobox :dark="darkmode" v-model="selected" :items="items" outlined dense hide-details :search-input.sync="search"
    :loading="isLoading" hide-no-data hide-selected item-text="name" :placeholder="placeholder" return-object
    :disabled="disabled" full-width no-filter :open-on-clear="false" class="search-loader" />
</template>

<script>
import TREK_API from "../services/trekApi";

export default {
  props: ["placeholder", "disabled", "index", "isOrigin", "isDestination"],
  data() {
    return {
      searchInterval: null,
      items: [],
      isLoading: false,
      search: null,
      selectedName: false
    };
  },
  computed: {
    selected: {
      get() {
        console.log("get selected")
        if (this.isOrigin) {
          return this.$store.state.origin.value
        } else if (this.isDestination) {
          return this.$store.state.destination.value
        } else {
          return this.$store.state.viaList[this.index].value

        }
      },
      set(item) {
        console.log("set selected")
        if (typeof item === "string") {
          // user has pressed enter instead of selected option
          return
        } else if (item !== null) {
          item = { lat: item.latitude, lng: item.longitude, value: item.name }
        }
        if (this.isOrigin) {
          this.$store.dispatch("CHANGE_ORIGIN", item)
        } else if (this.isDestination) {
          this.$store.commit("SET_DESTINATION", item)
        } else {
          this.$store.dispatch("SET_VIA_BOX", { index: this.index, item: item })
        }
        this.selectedName = item.name
        this.$store.dispatch("LOAD_ROUTE");
      }
    },
    darkmode() {
      return this.$store.state.darkmode;
    },
  },
  created() {
    console.log(1, this.disabled)
  },
  watch: {
    selected(val) {
      console.log("watch selected", val)
    },
    async search(val) {
      if (val == "" || val === null ) return;
      // search is retriggered after option is selected, leads to duplicated api call without this check:
      if (val === this.selected) return;
      let that = this;
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(async function () {
        that.isLoading = true;
        if (that.search == "") return;
        that.items = await TREK_API.getLocations(that.search);
        that.isLoading = false;
      }, 300);
    },
  },
};
</script>

<style scoped>
.search-loader {
  font-size: 0.7em;
}
</style>
