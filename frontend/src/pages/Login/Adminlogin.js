import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import authConstants from "../../store/constants/authConstants";
import authLogin from "../../store/selectors/authSelectors";

import {
  StyledInput,
  StyledButton,
  StyledLabel,
} from "../../styles/login/LoginPage.styled";

const AdminLoginContainer = styled.div`
  height: 460px;
  background: #eee;
  border-radius: 60% / 10%;
  transition: 0.8s ease-in-out;
  transform: ${(props) =>
    props.$isActive ? "translateY(-400px)" : "translateY(-100px)"};

  p {
    color: #573b8a;
    transform: ${(props) => (props.$isActive ? "scale(1)" : "scale(.6)")};
  }

  input {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    margin: 15px auto;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 0px;
`;

function LoginPage(props) {
  const { isActive, toggleForm } = props;
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginSession = useSelector(authLogin.selectAuthSession);
  const loading = useSelector(authLogin.selectAuthLoading);
  const error = useSelector(authLogin.selectAuthLoading);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch({
      type: authConstants.LOGIN_REQUEST,
      payload: {
        username: username,
        password: password,
      },
    });
  };

  useEffect(() => {
    if (loginSession?.success) {
      localStorage.setItem("token", loginSession.token);
      navigate("/admin");
    }
  }, [loginSession, navigate]);

  return (
    <AdminLoginContainer $isActive={isActive}>
      <Form>
        <StyledLabel style={{ marginTop: "30px" }} onClick={toggleForm}>
          Admin Login
        </StyledLabel>
        <StyledInput
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required=""
          autoComplete="on"
          disabled={!loading}
        />
        <StyledInput
          type="password"
          name="pswd"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required=""
          disabled={!loading}
        />
        <div style={{ height: "0.9em" }}>
          {error && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              username or password is incorrect!
            </div>
          )}
        </div>
        <StyledButton onClick={handleLogin}>Login</StyledButton>
      </Form>
    </AdminLoginContainer>
  );
}

export default LoginPage;
