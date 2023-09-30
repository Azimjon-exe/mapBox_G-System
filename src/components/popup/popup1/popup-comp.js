import React from "react";
import PopupWraperStyle from "./popup-style";

function PopupComp({title}){
  return (
    <PopupWraperStyle className="wrapper-popup">  
      <h4 style={{color: "#fff"}}>{title}</h4>
      <button type="button" 
      style={{
        color: "#fff",
        border: "none",
        outline: "none",
        borderRadius: '3px',
        backgroundColor: "#0070FF",
        }}>Batafsil...</button>
    </PopupWraperStyle>
  );
}

export default PopupComp;
