<template></template>

<script>
import TREK_API from "../services/trekApi";

export default {
  props: {
    targetUrl: String
  },

  async mounted() {
    let token = this.$route.query.jwt;
    console.log(token);
    if (!token) {
      console.log("no token?");
      return;
    }
    try {
      TREK_API.checkTokenValid(token)
      TREK_API.storeToken(token)
      this.$store.commit("SET_TREK_API_TOKEN", token)
    } catch {
      console.log("token from query invalid");
      return;
    }
    if (this.targetUrl) {
      console.log("sending to" + this.targetUrl)
      location.href = this.targetUrl;
    } else {
      console.log("sending home")
      this.$router.push({ "name": "me" })
    }
  },
};
</script>

