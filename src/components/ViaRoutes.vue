<template>
  <v-layout column>
    <v-flex>
      <v-layout v-for="(v, i) in via" :key="i" class="ma-1">
        <search-location @change="_handleViaChange($event, i)" />
        {{ v }}
        <v-btn class="mt-1" fab x-small text @click="removeVia(i)">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
    <v-flex xs1>
      <v-layout justify-center>
        <v-btn class="mx-2" fab x-small color="primary" @click="addVia">
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
    {{values}}
  </v-layout>
</template>

<script>
import SearchLocation from "./SearchLocation.vue";
export default {
  components: { SearchLocation },
  data() {
    return {
      id: 1,
      via: [],
      values: [],
    };
  },
  methods: {
    addVia() {
      this.via.push({ id: this.id++ });
    },
    removeVia(id) {
      this.via.splice(id, 1);
      this.values[id] = null;
    },
    _handleViaChange(e, v) {
      console.log("Handle change", e, v);
      this.values[v] = e;
      console.log(this.values);
    },
  },
};
</script>

<style>
</style>