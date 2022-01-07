<template>
</template>

<script>
export default {
  mounted() {
    let token = this.$route.query.jwt;
    console.log(token);
    if (!token) {
      console.log("no token?");
    } else {
      console.log("storing token");
      // TODO: check if token valid. Backend should have /user/is_authenticated endpoint
      window.localStorage.setItem("trekToken", token);
      let user_data_page = location.origin + "/#/me";
      console.log("redirecting to " + user_data_page)
      location.href = user_data_page
    }
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

