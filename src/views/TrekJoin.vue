<template>
    <div v-if="success">
     Joined trek!
    </div>
</template>

<script>
import TREK_API from "../services/trekApi";

export default {
    props: {
        inviteId: String
    },

    data() {
        return {
            success: null
        }
    },
    computed: {
    },
    mounted() {
        TREK_API.joinTrek(this.inviteId).then(trekId => {
            this.$router.push({ name: "TrekProgress", params: { id: trekId } })
        })
    },
    methods: {
    }
};
</script>

<style >
