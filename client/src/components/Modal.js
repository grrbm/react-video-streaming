import React from "react";
import "./Modal.css";

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
        <div className="title">
          <h1>Are you Sure You Want To Continue?</h1>
        </div>
        <div className="body">
          <p>
            The next page is awesome! You should move forward, you will enjoy
            it.
          </p>
        </div>
        <div className="footer">
          <button id="cancelBtn" onClick={handleCloseModal}>
            Cancel
          </button>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
