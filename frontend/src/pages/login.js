import React, {useEffect, useState} from "react";
import Header from "./home.js";
import "./css/signupLogin.css";
import API from "../API";
import {useNavigate} from "react-router-dom";


const LogIn = () => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorType, setErrorType] = useState(null);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    API.isLoggedIn().then(setLoggedIn)
    console.log('logged in', loggedIn);
  })

  if (loggedIn){
    navigate('/');
  }

  const InputBox = (props) => {
    return (
      <div>
        <input
          className="smallBox smallBoxlogin"
          placeholder={props.text}
          name={props.name}
          type={props.type}
          {...props}
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


  const handleLogin = async (formSubmissionEvent) => {
    formSubmissionEvent.preventDefault();
    try {
      let response = await API.login(email, password)
      console.log(response, response.status);
      if (response.status === 200){
        let tokens = await response.json();
        console.log(tokens);

        window.localStorage.setItem('authExpected', true);
        window.localStorage.setItem('accessToken', tokens['token']);

        navigate("/");
      }
      else{
        console.info('login failed');
        setErrorType('wrongCredentials');
      }

    }
    catch (e) {
      console.error(e);
      setErrorType('unknownError')
    }
  }




  return (
    <div className="base">
      <Header />
      <h2 className="welcomeLogin">Welcome Back!</h2>
      <div className="box">
        <form
          onSubmit={handleLogin}

        >
          {errorType && (() => {
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
          {InputBox({name:'email', type:'text',value:email, onChange:(e) => setEmail(e.target.value)})}

          <div className="label">Password</div>
          {InputBox({name:'password', type:'password', value:password, onChange:(e) => setPassword(e.target.value)})}

          <button
            type="submit"
            style={{ textDecoration: "none" }}
            className="smallBox2"
            data-testid="login button">
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
