import React from "react";

function Popup3D({ lngLat }) {
  return (
    <div
      style={{
        color: "#fff",
        fontSize: "1rem",
        marginTop: "20px",
        padding: "5px",
        width: "100%",
      }}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente magni
      <p>Lng: {lngLat.lng}</p>
      <p>Lat: {lngLat.lat}</p>
    </div>
  );
}

export default Popup3D;
