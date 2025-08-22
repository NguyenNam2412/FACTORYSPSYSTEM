import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // CSS mặc định, bạn có thể override

function CalendarStyle(props) {
  const {
    onChange,
    value,
    activeStartDate,
    locale,
    tileContent,
    onActiveStartDateChange,
    view,
  } = props;

  return (
    <Calendar
      onChange={onChange}
      value={value}
      activeStartDate={activeStartDate}
      onActiveStartDateChange={onActiveStartDateChange}
      locale={locale || "vi-VN"}
      tileContent={tileContent}
      view={view || "month"}
    />
  );
}

export default CalendarStyle;
