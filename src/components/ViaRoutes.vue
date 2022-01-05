<template>
  <v-layout column>
    <v-flex>
      <v-layout class="ma-1">
        <search-location @change="_handleViaChange" />
      </v-layout>
      <v-layout class="ma-2" justify-center>
        <v-btn class="mx-2" fab x-small color="primary" @click="addVia">
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-layout>
      <v-layout
        v-for="(v, i) in viaList"
        :key="i"
        class=""
        justify-space-between
      >
        <label class="mt-2">{{ v.name }}</label>
        <!-- ADD SKIP -->
        <v-btn class="mt-1" fab x-small text @click="removeVia(i)">
          <v-icon> mdi-close </v-icon>
        </v-btn>
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
      viaModel: null,
      viaList: [],
    };
  },
  methods: {
    _handleViaChange(e) {
      this.viaModel = e;
    },
    addVia() {
      this.viaList.push(this.viaModel);
      this.$store.commit("SET_VIA_LIST", this.viaList);
      this.$store.dispatch("LOAD_ROUTE");
    },
    removeVia(id) {
      this.viaList.splice(id, 1);
      this.$store.commit("SET_VIA_LIST", this.viaList);
      this.$store.dispatch("LOAD_ROUTE");
    },
  },
};
</script>

<style>
</style>