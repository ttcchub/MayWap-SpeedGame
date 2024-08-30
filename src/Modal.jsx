import React from "react";
import "./Modal.css";

const Modal = (props) => {
  const handleOverlayClick = (e) => {
    // Close the modal if the click is on the overlay
    if (e.target.classList.contains('overlay')) {
      props.closeModal();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h1 className="gover">GAME OVER</h1>
        <p className="final-score">Score: {props.score}</p>
        <p className="game-over-message">{props.message}</p>
        <button className="close-modal button" onClick={props.closeModal}>
          <span className="actual-text">Close</span>
          <span className="hover-text" aria-hidden="true">Close</span>
        </button>
      </div>
    </div>
  );
};

export default Modal;
