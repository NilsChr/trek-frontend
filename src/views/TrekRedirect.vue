<template></template>

<script>
import TREK_API from "../services/trekApi";

export default {
  async mounted() {
    let token = this.$route.query.jwt;
    console.log(token);
    if (!token) {
      console.log("no token?");
      return;
    }
    let is_authenticated = await TREK_API.isAuthenticated({ token: token });
    console.log(is_authenticated);
    if (!is_authenticated) {
      console.log("token from query invalid");
      return;
    }
    console.log("storing token");
    window.localStorage.setItem("trekToken", token);
    let user_data_page = location.origin + "/#/me";
    console.log("redirecting to " + user_data_page);
    location.href = user_data_page;
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

