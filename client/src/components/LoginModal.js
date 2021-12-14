import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { performLogin } from "../actions/appActions";
import Axios from "axios";
import clsx from "clsx";
import loginStyles from "./LoginModal.module.scss";

const LoginModal = ({ setModalActive }) => {
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      if (res.status === 200) {
        handleCloseModal();
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
    if (e) {
      e.stopPropagation();
    }
    setModalActive(false);
  };
  return (
    <div
      className={clsx(
        loginStyles.modalBackground,
        "fixed top-0 right-0 bottom-0 left-0 z-10 w-full h-full"
      )}
    >
      <div
        className={clsx(
          loginStyles.modalContainer,
          "flex text-center text-justify"
        )}
      >
        <div className={loginStyles.titleCloseBtn}>
          <button onClick={handleCloseModal}> X </button>
        </div>
        <div className={clsx(loginStyles.title, "w-full")}>
          <h1>Login</h1>
        </div>
        <div className={loginStyles.body}>
          <input
            className={loginStyles.textfield}
            type="email"
            name="email"
            ref={emailRef}
            placeholder="E-mail"
            autocomplete="autocomplete_off_hack_138r!n"
            required
          />
          <input
            className={loginStyles.textfield}
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
            <span className={loginStyles.highlighted_text}>subscribe now</span>
          </p>
          <button onClick={handleLogin}>Login</button>
        </div>
        <div className={loginStyles.footer}>This is footer</div>
      </div>
    </div>
  );
};

export default LoginModal;
