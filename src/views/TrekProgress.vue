<template>
    <v-container fluid fill-height class="pa-0 ma-0">
        <div id="map">
            <m-box :addContextMenu="canAddLeg"/>
        </div>

        <v-layout v-if="canAddLeg" fill-height>
            <v-flex xs2 id="menu">
                <search-menu />
            </v-flex>
            <v-btn @click="onSave" fab large fixed right bottom color="primary" :disabled="!(route)">
                <v-icon>mdi-content-save-plus</v-icon>
            </v-btn>
        </v-layout>
        <admin-speed-dial v-if="isTrekOwner" :id="id" />
        <bottom-navigation/>
    </v-container>
</template>

<script>
import SearchMenu from "../components/SearchMenu.vue";
import MBox from "../components/MBox.vue";
import AdminSpeedDial from "../components/AdminSpeedDial.vue";
import BottomNavigation from "../components/BottomNavigation"

import TREK_API from "../services/trekApi";

// should be moved to a utils
function nameForLatLng(lat, lng) {
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`
}

export default {
    components: { SearchMenu, MBox, AdminSpeedDial, BottomNavigation },
    props: {
        id: String
    },

    data() {
        return {
            width: 0,
            height: 0,
            isTrekOwner: false,
            canAddLeg: false,
        };
    },
    computed: {
        darkmode() {
            return this.$store.state.darkmode;
        },
        error() {
            return this.$store.state.error;
        },
        route() {
            return this.$store.state.route;
        },
    },
    created() {
        this.getTrekData()
    },
    mounted() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    },
    methods: {
        onSave() {
            TREK_API.addLeg(this.id, this.route.polyline).then(this.getTrekData)
        },
        getTrekData() {
            return TREK_API.getTrekData(this.id).then(trekData => {
                console.log(trekData)
                this.canAddLeg = trekData.can_add_leg
                console.log(trekData.current_location)
                this.isTrekOwner = trekData.is_owner
                if (trekData.current_location) {
                    const origin = {
                        lng: trekData.current_location.lon,
                        lat: trekData.current_location.lat,
                        value: nameForLatLng(trekData.current_location.lat, trekData.current_location.lon),
                        isFixed: true

                    }
                    this.$store.dispatch("CHANGE_ORIGIN", origin);
                }
                this.$store.commit("SET_TREK_IS_ACTIVE", trekData.is_active);
                trekData.legs.map(leg => this.$store.dispatch("LOAD_LEG",
                    { trekId: this.id, legId: leg.id }))
            });

        }
    }
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
