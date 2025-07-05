import styled from "styled-components";

export const StyledLabel = styled.p`
  color: #fff;
  font-size: 2.3em;
  justify-content: center;
  text-align: center;
  display: flex;
  margin: 40px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.5s ease-in-out;
`;

export const StyledInput = styled.input`
  width: 60%;
  height: 20px;
  background: #e0dede;
  display: flex;
  justify-content: center;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
`;

export const StyledButton = styled.button`
  width: 60%;
  height: 40px;
  margin: 10px auto;
  justify-content: center;
  display: block;
  color: #fff;
  background: #573b8a;
  font-size: 1em;
  font-weight: bold;
  margin-top: 20px;
  outline: none;
  border: none;
  border-radius: 5px;
  transition: 0.2s ease-in;
  cursor: pointer;

  &:hover {
    background: #6d44b8;
  }
`;
