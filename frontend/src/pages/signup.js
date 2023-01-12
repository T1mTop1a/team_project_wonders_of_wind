import Header from "./home.js";
import React from "react";
import { Link } from "react-router-dom";
import "./css/signupLogin.css";
import { useState } from "react";

const SignUp = () => {
  const InputBox2 = (props) => {
    return (
      <div>
        <input
          className="smallBox smallBoxSignup"
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
      <div className="box">
        <form
          method="POST"
          action={`${process.env.REACT_APP_BACKEND}/api/v1/signup`}
        >
          {(() => {
            if (errorType === "alreadyExists") {
              return (
                <div className="errorDisplay">
                  A user with this email address already exists!
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

          <h1 className="title">Sign Up</h1>

          <div className="label">Name </div>
          <InputBox2 name="name" type="text"></InputBox2>

          <div className="label">Email</div>
          <InputBox2 name="email" type="email"></InputBox2>

          <div className="label">Password</div>
          <InputBox2 name="password" type="password"></InputBox2>

          <button className="smallBox2" type="submit">
            SIGN UP
          </button>
          <p className="labelLink">
            Already have an account? <br />
            <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
