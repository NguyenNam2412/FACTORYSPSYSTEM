import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import authConstants from "../../store/constants/authConstants";
import authLogin from "../../store/selectors/authSelectors";

import styled from "styled-components";
import {
  StyledInput,
  StyledButton,
  StyledLabel,
} from "../../styles/login/LoginPage.styled";

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

function LoginPage(props) {
  const { isActive, toggleForm } = props;
  const dispatch = useDispatch();
  const [empId, setEmpId] = useState("");
  const loginSession = useSelector(authLogin.selectAuthSession);
  const loading = useSelector(authLogin.selectAuthLoading);
  const error = useSelector(authLogin.selectAuthLoading);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch({
      type: authConstants.LOGIN_REQUEST,
      payload: {
        empId: empId,
      },
    });
  };

  useEffect(() => {
    if (loginSession?.success) {
      localStorage.setItem("token", loginSession.token);
      navigate("/");
    }
  }, [loginSession, navigate]);

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
          disabled={!loading}
        />
        <div style={{ height: "0.9em" }}>
          {error && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              Employee ID doesn't exit!
            </div>
          )}
        </div>
        <StyledButton onClick={!loading && handleLogin}>Login</StyledButton>
      </Form>
    </EmpLoginContainer>
  );
}

export default LoginPage;
