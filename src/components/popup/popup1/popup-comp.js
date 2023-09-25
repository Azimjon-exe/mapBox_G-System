import React from "react";
import PopupWraperStyle from "./popup-style";
import { Table } from "react-bootstrap";

function PopupComp(){
  return (
    <PopupWraperStyle className="wrapper-popup">  
    <Table responsive className="table table-light table-hover table-bordered">
      <thead>
        <tr>
          <th>#</th>
          {Array.from({ length: 8 }).map((_, index) => (
            <th key={index}>Table heading</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          {Array.from({ length: 8 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>2</td>
          {Array.from({ length: 8 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>3</td>
          {Array.from({ length: 8 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
      </tbody>
    </Table>
    </PopupWraperStyle>
  );
}

export default PopupComp;
