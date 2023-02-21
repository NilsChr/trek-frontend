<template>
  <div class="ma-2" v-if="loaded">
    <h1>Hei {{ savedName }}</h1>

    <v-responsive class="ma-0 pa-0" :width="name.length > 20 ? `${name.length}rem` : '20rem'">
      <v-text-field v-model="name" label="New name" :placeholder="name">
        <template #append>
          <v-btn color="secondary" @click="onChangeName">
            Change display name
          </v-btn>
        </template>
      </v-text-field>
    </v-responsive>


    Select step tracker service:
    <v-radio-group v-model="selectedActiveTracker" @change="onChangeTracker" row>
      <div class="ma-1" v-for="tracker in trackerData">
        <v-radio :label="tracker.name.toUpperCase()" :key="tracker.name" :value="tracker.name"
          :disabled='!tracker.isSignedIn' />
        <v-btn class="ma-2" :color="tracker.color" @click="onAddTracker(tracker)" dark elevation="0">
          {{ tracker.isSignedIn ? "Reauthenticate" : "Sign in" }}
        </v-btn>
      </div>
    </v-radio-group>

    <bottom-navigation />
  </div>
</template>

<script>
import TREK_API from "../services/trekApi";
import trackers from "../services/trackers";

import BottomNavigation from "../components/BottomNavigation"

export default {
  components: { BottomNavigation },
  data() {
    return {
      loaded: false,
      savedName: "",
      name: "",
      treksUserIn: [],
      trackerData: [],
      selectedActiveTracker: "",
    };
  },
  methods: {
    onChangeName() {
      TREK_API.editUser({ name: this.name }).then(
        () => this.savedName = this.name
      )
    },
    onChangeTracker() {
      console.log(this.selectedActiveTracker)
      TREK_API.editUser({ active_tracker: this.selectedActiveTracker })
    },
    onAddTracker(tracker) {
      console.log(tracker.id)
      let targetUrl = window.location.href
      console.log(targetUrl)
      let handleRedirectRoute = this.$router.resolve({ name: "TrekRedirect", query: { targetUrl: targetUrl } })
      console.log(handleRedirectRoute)
      let handleRedirectUrl = window.location.origin + "/" + handleRedirectRoute.href
      console.log(handleRedirectUrl)
      TREK_API.getAddTrackerUrl(tracker.id, handleRedirectUrl)
        .then(trackerRedirectUrl => location.href = trackerRedirectUrl);
      ;
    },
  },
  created() {
    TREK_API.getUserData().then(userData => {
      this.trackerData = trackers.map(tracker => ({
        name: tracker.name,
        id: tracker.id,
        color: tracker.color,
        isActive: tracker.name === userData.active_tracker,
        isSignedIn: userData.all_trackers.includes(tracker.id)
      }))
      this.savedName = userData.name
      this.treksUserIn = userData.treks_user_in
      this.selectedActiveTracker = userData.active_tracker
      this.loaded = true
    })
  },


};
</script>

<style >
</style>

