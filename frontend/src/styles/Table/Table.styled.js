import styled from "styled-components";

export const TableContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 80vh;
  overflow: auto;
  background: #fff;

  --sb-thumb: rgba(0, 0, 0, 0.35);
  --sb-thumb-hover: rgba(0, 0, 0, 0.55);

  /* default header height (will be overwritten by JS after measure) */
  --header-height: 48px;

  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  &:hover,
  &.isScrolling {
    scrollbar-color: var(--sb-thumb) transparent;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 8px;
  }
  &:hover::-webkit-scrollbar-thumb,
  &.isScrolling::-webkit-scrollbar-thumb {
    background-color: var(--sb-thumb);
  }
  &:hover::-webkit-scrollbar-thumb:hover {
    background-color: var(--sb-thumb-hover);
  }
`;

export const Table = styled.table`
  /* use separate borders so sticky borders remain visible */
  border-collapse: separate;
  border-spacing: 0;
  table-layout: ${({ $fixed }) => ($fixed ? "fixed" : "auto")};
  width: max-content;
  min-width: 100%;
  position: relative;
  background: transparent;
`;

export const Th = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  background: #f5f5f5;
  font-weight: bold;
  background-clip: padding-box; /* prevent bleed of box-shadow */
  transform: translateZ(0);

  height: var(--header-height);
  line-height: var(--header-height);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;

  /* header cell that is only sticky as a column (left) */
  ${({ $sticky }) =>
    $sticky === "col" &&
    `
    position: sticky;
    left: 0;
    z-index: 25;
    background-color: #f5f5f5;
    border-left: 1px solid #ccc;
    box-shadow: 2px 0 3px rgba(0,0,0,0.06);
  `}

  /* header row (top) */
  ${({ $sticky }) =>
    $sticky === "row" &&
    `
    position: sticky;
    top: 0;
    z-index: 20;
    background-color: #f5f5f5;
    border-top: 1px solid #ccc;
    box-shadow: 0 2px 3px rgba(0,0,0,0.06);
  `}

  /* header cell that is both top and left (intersection) */
  ${({ $sticky }) =>
    $sticky === "both" &&
    `
    position: sticky;
    top: 0;
    left: 0;
    z-index: 30;
    background-color: #f5f5f5;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    box-shadow: 2px 2px 4px rgba(0,0,0,0.08);
  `}
`;

export const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  background-clip: padding-box;
  background-color: #fff;

  white-space: normal;
  word-break: break-word;
  vertical-align: top;

  /* sticky column cells in body */
  ${({ $sticky }) =>
    $sticky === "col" &&
    `
    position: sticky;
    left: 0;
    z-index: 15;
    background-color: #fff;
    border-left: 1px solid #ccc;
    box-shadow: 2px 0 3px rgba(0,0,0,0.04);
  `}
`;
