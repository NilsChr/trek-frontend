import axios from "axios";
import store from "../store/index";

function longLatToParams(longLtd) {
  return longLtd[1] + "%2C%20" + longLtd[0];
}

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://trek-api.eirik.dev";

const TREK_API = {
  getLocations: function (location) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + "/search/" + location);
        resolve(res.data.locations);
      } catch (e) {
        store.commit(
          "SET_ERROR",
          "Ops! A server error occured, while we are fixing it. Take a walk"
        );
        reject(e);
      }
    });
  },
  getRoute: function () {
    console.log("GET ROUTE");

    return new Promise(async (resolve, reject) => {
      try {
        let parsed = [];
        parsed.push(["start", longLatToParams(store.state.origin)]);
        parsed.push(["stop", longLatToParams(store.state.destination)]);

        for (let i = 0; i < store.state.viaList.length; i++) {
          let destination = [
            store.state.viaList[i]?.longitude,
            store.state.viaList[i]?.latitude,
          ];
          parsed.push(["via", longLatToParams(destination)]);
          if (store.state.viaList[i].skip) {
            parsed.push(["skip_segments", i + 1]);
          }
        }
        const params = new URLSearchParams([...parsed]);
        let res = await axios.get(url + "/route/" + params);
        resolve(res);
      } catch (e) {
        store.commit(
          "SET_ERROR",
          "Ops!A server error occured, while we are fixing it. Take a walk"
        );
        reject(e);
      }
    });
  },
  getAuthorizationUrl: function (tracker_name) {
    return new Promise(async (resolve, reject) => {
      try {
        let backend_url = new URL("/user/auth/" + tracker_name, url);
        backend_url.searchParams.set("redirect_url", location.origin + "/#/redirect");
        let res = await axios.get(backend_url);
        resolve(res.data.auth_url);
      } catch (e) {
        console.log("error!")
        console.log(e)
        reject(e);
      }
    });
  },
  getUserData: function () {
    let token = localStorage.getItem("trekToken");
    if (!(token)) {
      console.log("not logged in")
      return
    }
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + "/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        resolve(res.data);

      } catch (e) {
        console.log("error!")
        console.log(e)
        reject(e);
      }
    });
  }


};

export default TREK_API;
