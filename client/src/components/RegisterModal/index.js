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
        registerStyles.modalBackground,
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
          registerStyles.modalContainer,
          "flex text-center text-justify w-96 h-96 sm:w-3/5 sm:h-3/5 max-w-lg"
        )}
      >
        {/*<div className={registerStyles.titleCloseBtn}>
          <button onClick={handleCloseModal}> X </button>
        </div>*/}
        <div className={clsx(registerStyles.title, "w-full p-4 poppins-bold")}>
          <div>Register</div>
        </div>
        <div className={registerStyles.body}>
          <input
            className={clsx(
              registerStyles.textfield,
              "poppins-regular text-sm w-5/6 mt-8"
            )}
            type="text"
            name="username"
            ref={usernameRef}
            placeholder="Enter username"
            autocomplete="autocomplete_off_hack_asfjda"
            required
          />
          <input
            className={clsx(
              registerStyles.textfield,
              "poppins-regular text-sm w-5/6 mt-3"
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
              registerStyles.textfield,
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
          <br />
          <button
            className="mb-12 poppins-medium text-lg mt-12 w-5/6 mr-0 ml-0"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
