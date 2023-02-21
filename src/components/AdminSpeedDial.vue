<template>
    <div>
        <v-speed-dial fixed v-model="speedDialExpand" :top="true" :right="true" direction="bottom">
            <template v-slot:activator>
                <v-btn v-model="speedDialExpand" color="blue darken-2" dark fab>
                    <v-icon v-if="speedDialExpand">
                        mdi-close
                    </v-icon>
                    <v-icon v-else>
                        mdi-cog-outline
                    </v-icon>
                </v-btn>
            </template>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <div v-on="on" v-bind="attrs">
                        <v-switch :loading="switchIsLoading" v-model="trekIsActive" />
                    </div>
                </template>
                <span>{{ trekIsActive? 'Deactivate': 'Activate' }} trek </span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs" fab dark small color="green" @click="onInvite">
                        <v-icon>mdi-account-multiple-plus-outline</v-icon>
                    </v-btn>
                </template>
                <span> Generate invite url</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs" @click="addToDiscord">
                    Discord
                </v-btn>
                </template>

                <span> Add to discord</span>
            </v-tooltip>
        </v-speed-dial>
        <v-snackbar v-model="snackbar">
            Invite URL copied to clipboard
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>

import TREK_API from "../services/trekApi";

export default {
    props: {
        id: String
    },

    data() {
        return {
            speedDialExpand: false,
            switchIsLoading: false,
            snackbar: false
        };
    },
    computed: {
        darkmode() {
            return this.$store.state.darkmode;
        },

        trekIsActive: {
            get() {
                return this.$store.state.trekIsActive;
            },
            set(value) {
                this.switchIsLoading = true
                TREK_API.editTrek(this.id, { is_active: value })
                    .then(() => this.$store.commit("SET_TREK_IS_ACTIVE", value))
                    .catch(() => window.alert("failed to toggle active"))
                    .finally(() => this.switchIsLoading = false)
            }
        },
    },

    methods: {
        onInvite() {
            TREK_API.getInviteId(this.id)
                .then(inviteId =>
                    window.location.origin + "/" + this.$router.resolve({ name: 'TrekJoin', params: { inviteId: inviteId } }).href
                )
                .then(inviteUrl => navigator.clipboard.writeText(inviteUrl))
                .then(() => this.snackbar = true)
        },
        async copyInviteUrl() {
            await navigator.clipboard.writeText(this.inviteUrl);
            this.copied = true
        },
        async addToDiscord(){
            const originalUrl = window.location.href
            const discordRedirectUrl = await TREK_API.getAddToDiscordUrl(this.id, originalUrl);
            console.log(discordRedirectUrl);
            location.href = discordRedirectUrl;

        }

    }
};
</script>

