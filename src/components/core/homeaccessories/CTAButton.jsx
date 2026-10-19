import React from "react";
import { Link } from "react-router-dom";

const CTAButton = ({ children, active, linkto = "/signup" }) => {
  return (
    <Link
      to={linkto}
      className={`${active ? "btn-primary" : "btn-ghost"} font-inter`}
    >
      {children}
    </Link>
  );
};

export default CTAButton;
