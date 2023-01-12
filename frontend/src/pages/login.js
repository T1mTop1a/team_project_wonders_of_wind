import React from "react";
import Header from "./home.js";
import "./css/signupLogin.css";
import { Link } from "react-router-dom";

const LogIn = () => {
  const InputBox = (props) => {
    return (
      <div>
        <input
          className="smallBox smallBoxlogin"
          placeholder={props.text}
          name={props.name}
          type={props.type}
        ></input>
      </div>
    );
  };

  const messageDisplay = () => {
    var search = window.location.search;
    if (search == null) {
      return null;
    } else {
      return new URLSearchParams(search).get("error");
    }
  };
  const errorType = messageDisplay();

  return (
    <div className="base">
      <Header />
      <h2 className="welcomeLogin">Welcome Back!</h2>
      <div className="box">
        <form
          method="POST"
          action={`${process.env.REACT_APP_BACKEND}/api/v1/login`}
        >
          {(() => {
            if (errorType === "wrongCredentials") {
              return (
                <div className="errorDisplay">
                  Incorrect Password or Email! Please try again or sign up!
                </div>
              );
            } else if (errorType === "unknownError") {
              return (
                <div className="errorDisplay">
                  An error occured, please try again :)
                </div>
              );
            }
          })()}

          <h1 className="title">Log In</h1>

          <div className="label">Email</div>
          <InputBox name="email" type="email"></InputBox>

          <div className="label">Password</div>
          <InputBox name="password" type="password"></InputBox>

          <button
            type="submit"
            style={{ textDecoration: "none" }}
            className="smallBox2"
          >
            LOG IN
          </button>
          <p className="labelLink">
            Don't have an account? <br />
            <a href="/signup">SignUp</a>
          </p>
        </form>
      </div>
    </div>
  );
};
export default LogIn;
