import React, { useRef } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import "./RegisterModal.css";

const RegisterModal = ({ setModalActive }) => {
  const history = useHistory();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const handleRegister = async (e) => {
    const res = await Axios.post("/register", {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      username: usernameRef.current.value,
    });
    if (res.status === 200) {
      await performLogin(e);
    }
  };
  const performLogin = async (e) => {
    try {
      const res = await Axios.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      if (res.status === 200) {
        handleCloseModal(e);
        history.push("/");
        window.location.reload(true);
      }
    } catch (error) {
      console.log("Error with login. " + error);
    }
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
          <h1>Register</h1>
        </div>
        <div className="body">
          <input
            className="textfield"
            type="text"
            name="username"
            ref={usernameRef}
            placeholder="Enter username"
            autocomplete="autocomplete_off_hack_asfjda"
            required
          />
          <input
            className="textfield"
            type="email"
            name="email"
            ref={emailRef}
            placeholder="E-mail"
            placeholder="Enter email"
            autocomplete="autocomplete_off_hack_541gds"
            required
          />
          <input
            className="textfield"
            type="password"
            name="password"
            ref={passwordRef}
            placeholder="Password"
            autocomplete="autocomplete_off_hack_fdsa53s"
            required
          />
          <br />
          <button onClick={handleRegister}>Register</button>
        </div>
        <div className="footer">This is footer</div>
      </div>
    </div>
  );
};

export default RegisterModal;
