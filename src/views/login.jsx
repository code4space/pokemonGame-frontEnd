import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PokemonTheme1, clickSound } from "../components/playSound";
import Typewriter from "typewriter-effect";
import axios from "axios";
import { baseUrl } from "../constant/url";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  //handle login
  function login(e) {
    e.preventDefault();
    axios({
      url: baseUrl + "/login",
      method: "POST",
      data: {
        username: user.username,
        password: user.password,
      },
    })
      .then((res) => {
        if (res.statusText !== "OK") throw new Error("something went wrong");
        return res.data;
      })
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: `ERROR ${error.response.status}`,
          text: error.response.data.message,
        });
      });
  }

  //handle register
  function register(e) {
    clickSound();
    axios({
      url: baseUrl + "/register",
      method: "POST",
      data: {
        username: user.username,
        password: user.password,
      },
    })
      .then((res) => {
        if (res.statusText !== "Created") {
          throw new Error("something went wrong");
        }
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success Register",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: `ERROR ${error.response.status}`,
          text: error.response.data.message === "Username must be unique" ? 'Username already exist' : error.response.data.message,
        });
      });
  }

  return (
    <>
      {location.pathname === "/login" && PokemonTheme1()}
      <div className="login-ctrl">
        <form className="login-container pixelated-border" onSubmit={login}>
          <span className="user-login">
            User
            <Typewriter
              options={{
                strings: ["Login", "Register"],
                autoStart: true,
                loop: true,
                pauseFor: 1500,
                cursorClassName: "blinking-cursor",
                skipAddStyles: true,
              }}
            />
          </span>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
            }}
            value={user.username}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
            value={user.password}
            required
          />
          <div className="button-login-ctrl">
            <button type="submit" onClick={clickSound}>
              Login
            </button>
            <button onClick={register} type="button">
              Register
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
