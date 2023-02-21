<template>
    <v-layout>
        <v-flex class="d-flex flex-column-reverse">
            <div>
                <v-flex class="d-flex justify-center">
                    <v-bottom-navigation :max-width="240 + (120 * userTreks.length)" id="bottom-nav"
          color="primary"
                    >
                        <v-btn to="/user">
                            User
                            <v-icon>mdi-account-cog</v-icon>
                        </v-btn>
                        <v-btn to="/">
                            New trek
                            <v-icon>mdi-map-plus</v-icon>
                        </v-btn>

                        <v-btn v-for="(trekId, i) in userTreks" :to="`/trek/${trekId}`">
                            Active trek {{ userTreks.length > 1 ? `#${i + 1}` : '' }}
                            <v-icon>mdi-map</v-icon>
                        </v-btn>
                    </v-bottom-navigation>
                </v-flex>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import TREK_API from "../services/trekApi";

export default {
    computed: {
        userTreks() {
            return this.$store.state.userTreks;
        },
    },
    created() {
        TREK_API.getUserData().then(userData => {
            this.$store.commit("SET_USER_TREKS", userData.treks_user_in);
        })
    },



};
</script>


<style scoped>
bottom-nav {
    /* position: absolute; */
    bottom: 10px;
}
</style>
