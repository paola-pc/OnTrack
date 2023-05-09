import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import RegisterModal from "../Components/registerModal";

import "./Login.css";

const CLIENT_ID = "Iv1.0f2124a7d7aa9dee";

const LoginPage = () => {
  const [render, setReRender] = useState(false);
  const [isOpen, setOpen] = useState(false);

  function handleRegisterModal() {
    setOpen(!isOpen);
  }

  function loginWithGitHub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  function logoutFromGithub() {
    localStorage.removeItem("accessToken");
    setReRender(!render);
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    if (codeParam && localStorage.getItem("accessToken") === null) {
      //this should got in API service file
      async function getAccessToken() {
        try {
          await fetch(
            "http://localhost:3000/getAccessToken?code=" + codeParam,
            {
              method: "GET",
            }
          )
            .then((data) => {
              console.log("hello");
              console.log(typeof data);
              console.log("DATATATAT", data);
              return data.json();
            })
            .then(async (data) => {
              console.log("data", data);
              const userInfo = await fetch(
                "http://localhost:3000/getUserData",
                {
                  headers: {
                    Authorization: "Bearer " + data.access_token,
                  },
                }
              ).then((data) => data.json());
              console.log(" HOPEFULLY USER INFO ==> ", userInfo);
              if (data.access_token) {
                console.log("data.access_token =", data.access_token);
                localStorage.setItem("accessToken", data.access_token);
                setReRender(!render);
              }
            });
        } catch (e) {
          console.log("EEEEError", e);
        }
      }
      getAccessToken();
    }
  }, []);

  async function getUserData() {
    await fetch("http://localhost:3000/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        console.log("hello");
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <>
      <div className="wholepage">
        <div className="container">
          <h1 className="title">Login</h1>
          {localStorage.getItem("accessToken") ? (
            <>
              <h3 className="loggedin">You are logged in!</h3>
              <button onClick={getUserData}>Get Data from GitHub API</button>
              <Button
                sx={{ backgroundColor: "#568ea3" }}
                variant="contained"
                className="btn"
                type="submit"
                onClick={logoutFromGithub}
              >
                LogOut
              </Button>
            </>
          ) : (
            <>
              <div className="textinput">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input name="email" type="text"></input>
              </div>
              <div className="textinput" id="bottominput">
                <label className="label">Password</label>
                <input name="Password" type="password"></input>
              </div>
              <Button
                sx={{ backgroundColor: "#568ea3" }}
                variant="contained"
                className="btn"
                type="submit"
              >
                LOG IN
              </Button>
              <p className="dividerText"> OR </p>
              <Button
                onClick={loginWithGitHub}
                sx={{ backgroundColor: "#568ea3", margin: "5px" }}
                variant="contained"
                className="btn"
                type="submit"
              >
                Login With GitHub
              </Button>
              <div className="register">
                <button className="smallbtn" onClick={handleRegisterModal}>
                  <p>Or sign up for the first time by registering an account</p>
                </button>
              </div>
              {isOpen ? (
                <RegisterModal isOpen={isOpen} setOpen={setOpen} />
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default LoginPage;
