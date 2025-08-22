import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import Navbar from "@components/Navbar";

import { HideScrollBarContainer } from "@styles/common/hideScrollBarContainer.styled";

function HomePage() {
  return (
    <HideScrollBarContainer>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />

        <Navbar />

        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </HideScrollBarContainer>
  );
}

export default HomePage;
