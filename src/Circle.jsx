import React from "react";
import "./Circle.css";

const Circle = (props) => {
  // Create an Audio object with the sound file
  const sound = new Audio("/path-to-your-sound-file/sound2.mp3");

  const handleMouseDown = () => {
    sound.play();  // Play the sound when mouse is pressed
    if (props.clickHandler) {
      props.clickHandler(); // Call the passed click handler, if any
    }
  };

  return (
    <div
      className={`btn Circle ${props.active ? "active" : ""}`}
      onMouseDown={handleMouseDown}
    >
      {/* <h2>{props.id}</h2> */}



      
    </div>
    
    
  );
};

export default Circle;
