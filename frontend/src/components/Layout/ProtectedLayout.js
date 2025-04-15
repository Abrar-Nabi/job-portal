import React from "react";
import Navbar from "../Auth/Navbar";

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default ProtectedLayout;
