import React, { useRef } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import registerStyles from "./RegisterModal.module.scss";
import clsx from "clsx";

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
    <div
      className={clsx(
        registerStyles.modalBackground,
        "fixed top-0 right-0 bottom-0 left-0 z-10 w-full h-full"
      )}
    >
      <div
        className={clsx(
          registerStyles.modalContainer,
          "flex text-center text-justify"
        )}
      >
        <div className={registerStyles.titleCloseBtn}>
          <button onClick={handleCloseModal}> X </button>
        </div>
        <div className={clsx(registerStyles.title, "w-full")}>
          <h1>Register</h1>
        </div>
        <div className={registerStyles.body}>
          <input
            className={registerStyles.textfield}
            type="text"
            name="username"
            ref={usernameRef}
            placeholder="Enter username"
            autocomplete="autocomplete_off_hack_asfjda"
            required
          />
          <input
            className={registerStyles.textfield}
            type="email"
            name="email"
            ref={emailRef}
            placeholder="E-mail"
            placeholder="Enter email"
            autocomplete="autocomplete_off_hack_541gds"
            required
          />
          <input
            className={registerStyles.textfield}
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
        <div className={registerStyles.footer}>This is footer</div>
      </div>
    </div>
  );
};

export default RegisterModal;
