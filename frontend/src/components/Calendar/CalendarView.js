import React, { useState } from "react";
import CalendarStyle from "@components/Calendar";
import {
  CalendarWrapper,
  CalendarHeader,
  NavButtonGroup,
  NavButton,
} from "@styles/calendar/CalendarWrapper.styled";

function CalendarView(props) {
  const [activeStartDate, setActiveStartDate] = useState(new Date()); // tháng/năm hiển thị

  const formatMonthYear = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const changeMonth = (offset) => {
    setActiveStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const changeYear = (offset) => {
    setActiveStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + offset);
      return newDate;
    });
  };

  return (
    <CalendarWrapper>
      {/* Header custom */}
      <CalendarHeader>
        <NavButtonGroup>
          <NavButton onClick={() => changeYear(-1)}>{`<<`}</NavButton>
          <NavButton onClick={() => changeMonth(-1)}>{`<`}</NavButton>
        </NavButtonGroup>

        <span>{formatMonthYear(activeStartDate)}</span>

        <NavButtonGroup>
          <NavButton onClick={() => changeMonth(1)}>{`>`}</NavButton>
          <NavButton onClick={() => changeYear(1)}>{`>>`}</NavButton>
        </NavButtonGroup>
      </CalendarHeader>

      {/* Calendar */}
      <CalendarStyle
        {...props}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
      />
    </CalendarWrapper>
  );
}

export default CalendarView;
