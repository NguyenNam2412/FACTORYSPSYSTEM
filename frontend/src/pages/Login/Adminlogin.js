import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import authConstants from "@store/constants/authConstants";
import authSelectors from "@store/selectors/authSelectors";

import {
  StyledInput,
  StyledButton,
  StyledLabel,
} from "@styles/login/LoginPage.styled";

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

function AdminLogin(props) {
  const { isActive, toggleForm } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const loginSession = useSelector(authSelectors.selectAuthSession);
  const loading = useSelector(authSelectors.selectAuthLoading);
  const reduxError = useSelector(authSelectors.selectAuthError);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username and password cannot be empty");
      return;
    }

    setErrorMsg(null);
    dispatch({
      type: authConstants.LOGIN_REQUEST,
      payload: {
        side: "admin",
        username,
        password,
      },
    });
  };

  useEffect(() => {
    if (isActive && reduxError?.toLowerCase().includes("admin")) {
      setErrorMsg("username or password doesn't exist!");
    }
  }, [reduxError, isActive]);

  useEffect(() => {
    if (isActive && loginSession?.success) {
      setErrorMsg(null);
      localStorage.setItem("token", loginSession.token);
      localStorage.setItem("username", loginSession.username);
      navigate("/admin-side");
    }
  }, [isActive, loginSession, navigate]);

  useEffect(() => {
    if (!isActive) {
      setErrorMsg(null);
    }
  }, [isActive]);

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
          disabled={loading}
        />
        <StyledInput
          type="password"
          name="pswd"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
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
    </AdminLoginContainer>
  );
}

export default AdminLogin;
