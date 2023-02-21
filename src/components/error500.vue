<template>
  <v-layout column align-center class="pa-3">
    <v-card class="ma-3 pa-3" flat>
      <v-flex xs12>
        <svg
          width="186"
          height="117"
          viewBox="0 0 186 117"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          id="sad-server"
        >
          <g>
            <g id="server-man">
              <circle
                id="Ellipse 3"
                cx="45"
                cy="70"
                r="30.5"
                fill="#F5F5F5"
                stroke="black"
                stroke-width="3"
              />
              <circle id="Ellipse 4" cx="26.5" cy="60.5" r="1.5" fill="black" />
              <circle id="Ellipse 5" cx="61.5" cy="57.5" r="1.5" fill="black" />
              <path
                id="Vector 18"
                d="M26.2532 84.5882C28.2532 68.0882 56.2532 61.5882 67.7532 71.5882"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
              />
            </g>
            <g id="server">
              <rect
                id="Rectangle 5"
                x="95"
                y="57"
                width="71"
                height="27"
                rx="7"
                fill="#F4F4F4"
                stroke="black"
                stroke-width="2"
              />
              <rect
                id="left-light"
                x="100"
                y="62"
                width="29"
                height="9"
                rx="4"
                fill="#FF5151"
              />
              <rect
                id="Rectangle 8"
                x="101"
                y="63"
                width="27"
                height="7"
                rx="3"
                stroke="black"
                stroke-width="2"
              />
              <rect
                id="right-light"
                x="132"
                y="62"
                width="11"
                height="9"
                rx="4"
                fill="#FF5151"
              />
              <rect
                id="Rectangle 7"
                x="133"
                y="63"
                width="9"
                height="7"
                rx="3"
                stroke="black"
                stroke-width="2"
              />
            </g>
            <g id="hammer">
              <rect
                id="Rectangle 9"
                x="113.629"
                y="11.183"
                width="4.73951"
                height="40.0929"
                rx="2.36976"
                transform="rotate(38.4423 113.629 11.183)"
                fill="#BC8E48"
                stroke="black"
              />
              <rect
                id="Rectangle 8_2"
                x="106.167"
                y="8"
                width="20"
                height="10.3117"
                rx="3"
                transform="rotate(38.4423 106.167 8)"
                fill="black"
              />
            </g>
          </g>
        </svg>
      </v-flex>
      <v-flex xs12 class="pa-4" style="text-align: center; font-size: 0.9em">
        <p>{{error}}</p>
      </v-flex>
      <v-flex xs12>
        <v-btn color="primary" small block depressed @click="resetError">Ok</v-btn>
      </v-flex>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  methods: {
    resetError() {
      this.$store.commit("SET_ERROR", null);
    },
  },
  computed: {
    error() {
      return this.$store.state.error;
    },
  },
};
</script>

<style>
#sad-server {
  height: 80px;
}

#hammer {
  opacity: 0;
  /*animation: hammer-slam 2s infinite;*/
  transform-origin: 70px 50px;
}

@keyframes hammer-slam {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

#left-light {
  opacity: 0;
  animation: alarm 2s infinite;
}
#right-light {
  opacity: 0;
  animation: alarm 2s infinite;
}
@keyframes alarm {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
