import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import authConstants from "@store/constants/authConstants";
import authSelectors from "@store/selectors/authSelectors";

import styled from "styled-components";
import {
  StyledInput,
  StyledButton,
  StyledLabel,
} from "@styles/login/LoginPage.styled";

const EmpLoginContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  p {
    transform: ${(props) => (props.$isActive ? "scale(1)" : "scale(.6)")};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const AnimatedDiv = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: max-height 0.8s ease-in-out;

  max-height: ${(props) => (props.$isActive ? "200px" : "100px")};
`;

function EmpLogin(props) {
  const { isActive, toggleForm } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [empId, setEmpId] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const loginSession = useSelector(authSelectors.selectAuthSession);
  const loading = useSelector(authSelectors.selectAuthLoading);
  const reduxError = useSelector(authSelectors.selectAuthError);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!empId.trim()) {
      setErrorMsg("Employee ID cannot be empty");
      return;
    }

    setErrorMsg(null);
    dispatch({
      type: authConstants.LOGIN_REQUEST,
      payload: {
        side: "employee",
        empId,
      },
    });
  };

  useEffect(() => {
    if (isActive && reduxError?.toLowerCase().includes("emp")) {
      setErrorMsg("Employee ID doesn't exist!");
    }
  }, [reduxError, isActive]);

  useEffect(() => {
    if (isActive && loginSession?.success) {
      setErrorMsg(null);
      localStorage.setItem("token", loginSession.token);
      const empInfo = {
        empId: loginSession.empId,
        empName: loginSession.empName,
        role: loginSession.role,
      };
      localStorage.setItem("empInfo", JSON.stringify(empInfo));
      navigate("/");
    }
  }, [isActive, loginSession, navigate]);

  useEffect(() => {
    if (!isActive) {
      setErrorMsg(null);
    }
  }, [isActive]);

  return (
    <EmpLoginContainer $isActive={isActive} onClick={toggleForm}>
      <Form>
        <AnimatedDiv $isActive={isActive}>
          <StyledLabel>Employee Login</StyledLabel>
        </AnimatedDiv>
        <StyledInput
          type="text"
          name="empID"
          placeholder="Employee ID"
          onChange={(e) => setEmpId(e.target.value)}
          required=""
          disabled={loading}
        />
        <div style={{ height: "0.9em" }}>
          {errorMsg && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              {errorMsg || "Unknown error"}
            </div>
          )}
        </div>
        <StyledButton onClick={isActive && !loading ? handleLogin : null}>
          Login
        </StyledButton>
      </Form>
    </EmpLoginContainer>
  );
}

export default EmpLogin;
