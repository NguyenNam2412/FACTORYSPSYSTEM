import styled from "styled-components";

export const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: Arial, sans-serif;
  }

  .react-calendar__navigation {
    display: none;
  }

  .react-calendar__month-view__weekdays {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8rem;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 5px 0;
  }

  .react-calendar__tile {
    border: 1px solid #eee;
    height: 60px;
    text-align: center;
    padding: 10px 0;
    font-size: 0.9rem;
    position: relative;
  }

  .react-calendar__tile--active {
    color: #fff;
  }

  /* Dot menu */
  .calendar-dot {
    background: #4caf50;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    margin: auto;
    margin-top: 2px;
  }

  /* Checkbox */
  .calendar-checkbox {
    position: absolute;
    top: 2px;
    right: 2px;
    transform: scale(0.8);
    cursor: pointer;
  }

  .calendar-checkbox:disabled {
    opacity: 0.4;
    cursor: normal;
  }
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: monospace;
`;

export const NavButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

export const NavButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 1rem;
  cursor: pointer;
  font-family: monospace;

  &:hover {
    background: #f0f0f0;
  }
`;
