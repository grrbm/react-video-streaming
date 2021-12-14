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
    if (e) {
      console.log("handling close modal " + e.target);
      console.log("stopping propagation");
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
      onClick={(e) => {
        if (e.target.className.includes("modalBackground")) {
          handleCloseModal(e);
        }
      }}
    >
      <div
        className={clsx(
          loginStyles.modalContainer,
          "flex text-center text-justify w-96 h-96 sm:w-3/5 sm:h-3/5 max-w-lg"
        )}
      >
        {/*<div className={loginStyles.titleCloseBtn}>
          <button onClick={handleCloseModal}> X </button>
        </div>*/}
        <div className={clsx(loginStyles.title, "w-full p-4 poppins-bold")}>
          <div>Login</div>
        </div>
        <div className={loginStyles.body}>
          <input
            className={clsx(
              loginStyles.textfield,
              "poppins-regular text-sm w-5/6 mt-8"
            )}
            type="email"
            name="email"
            ref={emailRef}
            placeholder="E-mail"
            autocomplete="autocomplete_off_hack_138r!n"
            required
          />
          <input
            className={clsx(
              loginStyles.textfield,
              "poppins-regular text-sm w-5/6 mt-3"
            )}
            type="password"
            name="password"
            ref={passwordRef}
            type="password"
            placeholder="Password"
            autocomplete="autocomplete_off_hack_xfr4!k"
            required
          />
          <p className={"poppins-regular text-sm mt-12"}>
            Not registered yet ?{" "}
            <span className={loginStyles.highlighted_text}>subscribe now</span>
          </p>
          <button
            className="mb-12 poppins-medium text-lg mt-12 w-5/6 mr-0 ml-0"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
