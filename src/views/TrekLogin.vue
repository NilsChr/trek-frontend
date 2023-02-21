<template>
  <v-layout fill-height justify-center align-center column>
    <v-flex xs3>
      <v-layout justify-center align-center>
        <v-img :src="require('../assets/trek-logo.svg')" class="my-3" contain height="200" width="200" />
      </v-layout>
    </v-flex>
    <v-flex xs4>
      <v-layout align-center wrap justify-center>
        <v-flex xs12 class="ma-5" style="text-align:center;">
          <label>Sign in to continue</label>
        </v-flex>
        <v-flex class="ma-1" xs7 v-for="tracker in trackers" :key="tracker.name">
          <v-btn :color="tracker.color" @click="login(tracker)" dark block elevation="0">
            {{ tracker.name }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    <div id="flavor-top"></div>
    <div id="flavor-bot"></div>
  </v-layout>
</template>

<script>
import TREK_API from "../services/trekApi";
import trackers from "../services/trackers";

export default {
  props: {
    targetUrl: String
  },
  data() {
    return {
      trackers: trackers,
    };
  },
  methods: {
    async login(tracker) {
      let handleRedirectRoute = this.targetUrl ?
        this.$router.resolve({ name: "TrekRedirect", query: { targetUrl: this.targetUrl } }) :
        this.$router.resolve({ name: "TrekRedirect" })
      console.log(handleRedirectRoute)
      let handleRedirectUrl = window.location.origin + "/" + handleRedirectRoute.href
      console.log(handleRedirectUrl)
      let trackerRedirectUrl = await TREK_API.getLoginUrl(tracker.id, handleRedirectUrl);
      console.log(trackerRedirectUrl);
      location.href = trackerRedirectUrl;
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

#fitbit-signin {
  background: url("https://gcs-assets.fitbit.com/prod/109d9919a44b792ebe64e520c3b57dc2.svg");
  width: 125px;
  height: 32px;
}

#fitbit-signin:hover {
  cursor: pointer;
}

#flavor-top {
  background-color: #94e016;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 50%;
  height: 30%;
  clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
}

#flavor-bot {
  background-color: #0095b2;
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 50%;
  height: 30%;
  clip-path: polygon(0% 100%, 100% 0%, 100% 100%);
}
</style>
