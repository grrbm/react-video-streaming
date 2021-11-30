import React, { useEffect, useRef } from "react";
import { performLogin } from "../actions/appActions";
import Axios from "axios";
import "./LoginModal.css";

const LoginModal = ({ setModalActive }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await Axios.post("/login", {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    console.log("performed login");
  };
  const handleCloseModal = (e) => {
    console.log("handling close modal");
    e.stopPropagation();
    setModalActive(false);
  };
  return (
    <div className="modalBackground fixed top-0 right-0 bottom-0 left-0 z-10 w-full h-full">
      <div className="modalContainer flex text-center text-justify">
        <div className="titleCloseBtn">
          <button onClick={handleCloseModal}> X </button>
        </div>
        <div className="title w-full">
          <h1>Login</h1>
        </div>
        <div className="body">
          <input
            className="textfield"
            type="email"
            name="email"
            ref={emailRef}
            placeholder="E-mail"
            autocomplete="autocomplete_off_hack_138r!n"
            required
          />
          <input
            className="textfield"
            type="password"
            name="password"
            ref={passwordRef}
            type="password"
            placeholder="Password"
            autocomplete="autocomplete_off_hack_xfr4!k"
            required
          />
          <p>
            Not registered yet ?{" "}
            <span className="highlighted-text">subscribe now</span>
          </p>
          <button onClick={handleLogin}>Login</button>
        </div>
        <div className="footer">This is footer</div>
      </div>
    </div>
  );
};

export default LoginModal;
