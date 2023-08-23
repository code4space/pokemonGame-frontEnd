import { baseUrl } from "../../constant/url";
import { USER } from "./actionType";
import axios from "axios";

export function userFetchSuccess(payload) {
  return {
    type: USER,
    payload,
  };
}

export function getUserInfo() {
  return async (dispatch, getState) => {
    try {
      const response = await axios({
        url: baseUrl + "/user",
        method: "GET",
        headers: { access_token: localStorage.getItem('access_token') },
      })
      const data = response.data.data
      console.log(data)
      dispatch(userFetchSuccess({ gacha: data.gacha, balls: data.balls, draw: data.draw, username: data.username }));
    } catch (error) {
      console.log(error);
    }
  };
}