import axios from "axios";
import store from "../store/index";

function longLatToParams(longLtd) {
  return longLtd[1] + "," + longLtd[0];
}

function sanitizeLocation(location) {
  if(!location) return '';
  location = location.replaceAll(/æ/g, "ae");
  location = location.replaceAll(/ø/g, "o");
  location = location.replaceAll(/å/g, "aa");
  location = location.replaceAll(/ö/g, "o");
  location = location.replaceAll(/ä/g, "a");
  return location;
}

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://trek-api.eirik.dev";

const TREK_API = {
  getLocations: function (location) {
    return new Promise(async (resolve, reject) => {
      try {
        if(!location) return resolve([]);
        const params = new URLSearchParams();
        params.append("query", sanitizeLocation(location));
        let res = await axios.get(url + "/search/locations?" + params);
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
    return new Promise(async (resolve, reject) => {
      try {
        let parsed = [];
        parsed.push(["start", longLatToParams(store.state.origin)]);
        parsed.push(["stop", longLatToParams(store.state.destination)]);

        if (store.state.origin[0] === 0 && store.state.origin[1] === 0)
          return reject();
        if (
          store.state.destination[0] === 0 &&
          store.state.destination[1] === 0
        )
          return reject();

        for (let i = 0; i < store.state.viaList.length; i++) {
          let destination = [
            store.state.viaList[i]?.longitude,
            store.state.viaList[i]?.latitude,
          ];
          if (destination[0] === 0 || destination[1] === 0) continue;
          parsed.push(["via", longLatToParams(destination)]);
          if (store.state.viaList[i].skip) {
            parsed.push(["skip_segments", i + 1]);
          }
        }
        const params = new URLSearchParams([...parsed]);
        let res = await axios.get(url + "/search/route?" + params);
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
        backend_url.searchParams.set(
          "redirect_url",
          location.href.replace("/login", "/redirect")
        );
        let res = await axios.get(backend_url);
        resolve(res.data.auth_url);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  isAuthenticated: function ({ token = null }) {
    // checks user authentication. Either with passed token, or token from localstorage
    if (token === null) {
      token = localStorage.getItem("trekToken");
    }
    if (!token) {
      console.log("not logged in");
      return false;
    }
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + "/user/is_authenticated", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(async (response) => response.status === 200);
        resolve(res);
      } catch (e) {
        // todo: check status code of failed request
        resolve(false);
      }
    });
  },
  getUserData: function () {
    let token = localStorage.getItem("trekToken"); // TODO refactor into function and put somewhere nice
    if (!token) {
      console.log("not logged in");
      return;
    }
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + "/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(res.data);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
};

export default TREK_API;
