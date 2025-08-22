import styled from "styled-components";

export const HideScrollBarContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto; /* vẫn scroll được */
  overflow-x: hidden; /* thường ẩn ngang */

  /* Firefox */
  scrollbar-width: none;
  /* IE, Edge cũ */
  -ms-overflow-style: none;

  /* Chrome, Safari, Edge (webkit) */
  &::-webkit-scrollbar {
    display: none;
  }
`;
