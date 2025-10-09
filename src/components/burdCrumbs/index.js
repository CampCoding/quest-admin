import React from "react";
import "./style.css";
const BurdCrumbs = ({ title }) => {
  return <h3 className="Page Title">{title ? title : null}</h3>;
};

export default BurdCrumbs;
