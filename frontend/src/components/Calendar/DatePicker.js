import { useState, useRef, useEffect } from "react";
import CalendarView from "./CalendarView";

import { formatDate } from "@utils/dateTime/formatDate";

function DatePicker(props) {
  const { selectedDate, setSelectedDate } = props;
  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!showCalendar) return;

    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showCalendar]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <input
        type="text"
        value={formatDate.toLocalDateStr(selectedDate)}
        onClick={() => setShowCalendar(!showCalendar)}
        readOnly
        style={{ padding: "6px", width: "150px" }}
      />

      {/* Calendar popup */}
      {showCalendar && (
        <div
          style={{
            position: "absolute",
            top: "31px",
            zIndex: 1000,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
          }}
        >
          <CalendarView
            onChange={(date) => {
              setSelectedDate(date);
              setShowCalendar(false);
            }}
            value={selectedDate}
            locale="vi-VN"
            viewType="datePicker"
            customStyle={{
              headerStyle: {
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "0px 10px",
                align: "center",
              },
              calendarStyle: {
                tile: {
                  base: {},
                  active: {},
                  today: {},
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;
