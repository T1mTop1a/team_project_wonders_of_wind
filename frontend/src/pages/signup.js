import Header from "./home.js";
import React, {useState} from "react";
import "./css/signupLogin.css";
import API from "../API";
import {useNavigate} from "react-router-dom";

const SignUp = () => {


  const [errorType, setErrorType] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();

  const InputBox2 = (props) => {
    return (
      <div data-testid="input box">
        <input
          required
          className="smallBox smallBoxSignup"
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


  const handleSubmit =async (submitEvent) => {
    submitEvent.preventDefault();
    try {
      let response = await API.signUp(name, email, password)
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
        setErrorType('alreadyExists');
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
      <div className="box">
        <form
          onSubmit={handleSubmit}

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

          <div className="label" data-testid="name input">Name </div>
          {InputBox2({'value': name, 'name':'name', 'type': 'text', onChange:(e) => setName(e.target.value)})}

          <div className="label" data-testid="email input">Email</div>
          {InputBox2({'value': email, 'name':'email', 'type': 'email', onChange:(e) => setEmail(e.target.value)})}

          <div className="label" data-testid="password input">Password</div>
          {InputBox2({'value': password, 'name':'password', 'type': 'password', onChange:(e) => setPassword(e.target.value)})}

          <button className="smallBox2" type="submit" data-testid="signup button">
            SIGN UP
          </button>
          <p className="labelLink">
            Already have an account? <br />
            <a href="/login" data-testid="login link">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
