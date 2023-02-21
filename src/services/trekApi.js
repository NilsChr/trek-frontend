import axios from "axios";
import store from "../store/index";

const TOKEN_NAME = "trekToken"
function longLatToParams(item) {
  return item.lat + "," + item.lng;
}

function sanitizeLocation(location) {
  if (!location) return '';
  return location;
}


function loadToken() {
  return localStorage.getItem(TOKEN_NAME);
}

function getAuthHeader() {
  let token = store.state.trekApiToken
  if (token === null) {
    throw new Error("not logged in");
  }
  return {
    Authorization: `Bearer ${token}`,
  }
}

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://trek-api.eirik.dev";



const TREK_API = {
  getLocations: function (location) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!location) return resolve([]);
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
        if (store.state.origin.value === null)
          return reject();
        if (store.state.destination.value === null)
          return reject();
        let parsed = [];
        parsed.push(["start", longLatToParams(store.state.origin)]);
        parsed.push(["stop", longLatToParams(store.state.destination)]);

        const nonEmptyViaPoints = store.state.viaList.filter(item => item.value !== null)
        nonEmptyViaPoints.forEach(point => parsed.push(["via", longLatToParams(point)]))

        if (store.state.origin.skip) {
          parsed.push(["skip_segments", 1])
        }
        nonEmptyViaPoints.forEach((point, index) => {
          if (point.skip) {
            parsed.push(["skip_segments", index + 2])
          }
        })
        const params = new URLSearchParams([...parsed]);
        let res = await axios.get(url + "/search/route?" + params);
        resolve(res);
      } catch (e) {
        let errorMessage
        if (e?.response?.data?.error_code === "E301SearchAPIError" && e?.response?.data?.description) {
          errorMessage = e.response.data.description
        } else if (e?.response?.data?.error_code === "E302NoRouteFound") {
          errorMessage = "No route found for those locations"
        } else if (e?.response?.data?.error_code === "E303RouteTooLong") {
          errorMessage = "Route too long"
        } else {
          errorMessage = "Ops! A server error occured. While we are fixing it: take a walk"
        }
        store.commit("SET_ERROR", errorMessage);
        reject(e);
      }
    });
  },

  getLoginUrl: function (trackerName, originalUrl) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestUrl = new URL("/user/login/" + trackerName, url);
        requestUrl.searchParams.set("frontend_redirect_url", originalUrl);
        let res = await axios.get(requestUrl);
        resolve(res.data.auth_url);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  getAddTrackerUrl: function (trackerName, originalUrl) {
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let requestUrl = new URL("/user/add_tracker/" + trackerName, url);
        requestUrl.searchParams.set("frontend_redirect_url", originalUrl);
        let res = await axios.get(requestUrl, { headers: header });
        resolve(res.data.auth_url);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  storeToken: function (token) {
    localStorage.setItem(TOKEN_NAME, token);
  },
  isAuthenticated: async function () {
    console.log("isAuthenticated")
    if (store.state.trekApiToken !== null) {
      console.log("token in state")
      return true
    }
    let token = loadToken();
    if (token === null) {
      console.log("no token in localstorage")
      return false
    }
    const isValid = await this.checkTokenValid(token)
    if (!isValid) {
      return false
    }
    store.commit("SET_TREK_API_TOKEN", token)
    return true
  },
  checkTokenValid: function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + "/user/is_authenticated", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(async (response) => response.status === 200);
        resolve(res);
      } catch (e) {
        console.log("failed")
        // TODO: check status code of failed request
        resolve(false);
      }
    })
  },
  getUserData: function () {
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + "/user/me", { headers: header });
        resolve(res.data);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  editUser(data) {
    console.log(data)
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.put(url + `/user/me`, data, { headers: header });
        resolve();
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    })
  },
  getTrekData: function (trekId) {
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + "/trek/" + trekId, { headers: header });
        resolve(res.data);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  addTrek(polyline) {
    let header = getAuthHeader()
    let payload = {
      polyline: polyline,
    }
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.post(url + "/trek", payload, { headers: header });
        resolve({
          trekId: res.data.trek_id,
        });
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    })
  },
  editTrek(trekId, data) {
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.put(url + `/trek/${trekId}`, data, { headers: header });
        resolve();
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    })
  },
  addLeg(trekId, polyline) {
    let header = getAuthHeader()
    let payload = {
      polyline: polyline,
    }
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.post(url + `/trek/${trekId}/leg`, payload, { headers: header });
        resolve({
          legId: res.data.leg_id,
        });
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    })
  },
  getLegData: function (trekId, legId) {
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(`${url}/trek/${trekId}/leg/${legId}`, { headers: header });
        resolve(res.data);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  getInviteId: function (trekId) {
    /**
     * Generates encrypted inviteId, which can be included in URL and shared with others.
     * If an other user sends request to /trek/join/${inviteId}, they join the trek
     */
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url + `/trek/${trekId}/invitation`, { headers: header });
        resolve(res.data.invite_id);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  joinTrek(inviteId) {
    /**
     * Join trek from invite
     */
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.post(url + `/trek/${inviteId}/join`, {}, { headers: header });
        resolve(res.data.trek_id);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });
  },
  getAddToDiscordUrl(trekId, originalUrl) {
    let header = getAuthHeader()
    return new Promise(async (resolve, reject) => {
      try {
        let requestUrl = new URL(`/output/discord/add/${trekId}`, url);
        requestUrl.searchParams.set("frontend_redirect_url", originalUrl);
        let res = await axios.get(requestUrl, { headers: header });
        resolve(res.data.url);
      } catch (e) {
        console.log("error!");
        console.log(e);
        reject(e);
      }
    });

  }
};

export default TREK_API;
