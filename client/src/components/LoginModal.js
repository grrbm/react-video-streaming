import React from "react";
import "./LoginModal.css";

const Modal = ({ setModalActive }) => {
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
          <form
            autocomplete="autocomplete_off_hack_1pijmg"
            action="/login"
            method="post"
          >
            <input
              className="textfield"
              type="email"
              name="email"
              placeholder="E-mail"
              autocomplete="autocomplete_off_hack_138r!n"
              required
            />
            <input
              className="textfield"
              type="email"
              name="email"
              type="password"
              placeholder="Password"
              autocomplete="autocomplete_off_hack_xfr4!k"
              required
            />
            <p>
              Not registered yet ?{" "}
              <span className="highlighted-text">subscribe now</span>
            </p>
            <button type="submit">Login</button>
          </form>
        </div>
        <div className="footer">This is footer</div>
      </div>
    </div>
  );
};

export default Modal;
