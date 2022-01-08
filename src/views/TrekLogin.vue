<template>
  <v-layout fill-height justify-center align-center column>
    <v-flex xs3>
      <v-layout justify-center align-center>
        <v-img
          :src="require('../assets/trek-logo.svg')"
          class="my-3"
          contain
          height="200"
          width="200"
        />
      </v-layout>
    </v-flex>
    <v-flex xs4>
      <v-layout column align-center>
        <v-flex class="text-xs-center ma-5"
          >Sign in with fitbit to continue</v-flex
        >
        <v-flex class="mt-5">
          <div id="fitbit-signin" @click="login('fitbit')"></div>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-img 
      id="trip"
      :src="'https://media.istockphoto.com/photos/silhouettes-of-hikers-at-sunset-picture-id1189073186?k=20&m=1189073186&s=612x612&w=0&h=A39ulfvLTHbKMNgj6xJV5Xq4ZJEcd66cNlsOJRey1Xk='"
    ></v-img>
    <div id="flavor-top"></div>
    <div id="flavor-bot"></div>
  </v-layout>
</template>

<script>
import TREK_API from "../services/trekApi";

export default {
  methods: {
    async login(tracker_name) {
      let redirect_url = await TREK_API.getAuthorizationUrl(tracker_name);
      console.log(redirect_url);
      location.href = redirect_url;
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

#trip {
  width:100%; 
  height:100%; 
  position: absolute;    
  mask-image: linear-gradient(to top right, rgba(0,0,0,0.2), rgba(0,0,0,0));
}
#flavor-top {
  background-color: #94E016;
  position: absolute;
  top:0px;
  left: 0px;
  width: 50%;
  height: 30%;
  clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
}
#flavor-bot {
  background-color: #0095b2;
  position: absolute;
  bottom:0px;
  right: 0px;
  width: 50%;
  height: 30%;
  clip-path: polygon(0% 100%, 100% 0%, 100% 100%);
}
</style>
