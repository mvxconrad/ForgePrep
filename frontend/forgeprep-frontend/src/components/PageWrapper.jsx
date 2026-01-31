import React from "react";
import backgroundImage from "../assets/background_abstract2.png";
import { Container } from "react-bootstrap";

const PageWrapper = ({ children }) => {
  return (
    <div className="position-relative bg-dark text-light overflow-hidden" style={{ minHeight: "100vh" }}>
      <img
        src={backgroundImage}
        alt="Background"
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ opacity: 0.2, zIndex: 0 }}
      />
      <Container style={{ zIndex: 2, position: "relative", paddingTop: "80px", paddingBottom: "40px" }}>
        {children}
      </Container>
    </div>
  );
};

export default PageWrapper;
