import { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import EmployeeLogin from "./EmpLogin";
import AdminLogin from "./AdminLogin";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: 'Jost', sans-serif;
    background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
  }
`;

const MainContainer = styled.div`
  width: 350px;
  height: 500px;
  background: red;
  overflow: hidden;
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
  border-radius: 10px;
  box-shadow: 5px 20px 50px #000;
  position: relative;
`;

function LoginPage() {
  const [isLoginActive, setIsLoginActive] = useState(false);

  return (
    <>
      <GlobalStyle />
      <MainContainer>
        <EmployeeLogin
          isActive={!isLoginActive}
          toggleForm={() => setIsLoginActive(false)}
        />
        <AdminLogin
          isActive={isLoginActive}
          toggleForm={() => setIsLoginActive(true)}
        />
      </MainContainer>
    </>
  );
}

export default LoginPage;
