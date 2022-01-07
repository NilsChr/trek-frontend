<template>
  <div id="data">{{ user_data }}</div>
</template>

<script>
import TREK_API from "../services/trekApi";
export default {
  data() {
    return { user_data: "" };
  },
  async created() {
    console.log("getting data");
    let user_data = await TREK_API.getUserData();
    console.log(`user_data: ${user_data}`);
    this.user_data = user_data;
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

