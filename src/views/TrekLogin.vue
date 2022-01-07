<template>
  <div>
    <h1>login</h1>
    <button type="button" v-on:click="login('fitbit')">Fitbit</button>
  </div>
</template>

<script>
import TREK_API from "../services/trekApi";

export default {
  methods: {
     async login(tracker_name) {
         let redirect_url = await TREK_API.getAuthorizationUrl(tracker_name)
         console.log(redirect_url)
         location.href = redirect_url
    },
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
