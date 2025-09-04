import { useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // default css
import { CalendarSkin } from "@styles/calendar/CalendarSkin.styled";

const PROJECT_DEFAULT_STYLE_CONFIG = {
  calendar: {
    /* container */
    background: "#fff",
    border: "1px solid #ddd",
    radius: "6px",
    fontSize: "14px",
    padding: "0",
    fontFamily: "Arial, sans-serif",
  },
  nav: {
    /* navigation wrapper */
    height: "40px",
    gap: "8px",
    label: {
      fontSize: "1rem",
      fontWeight: "600",
    },
    button: {
      /* nav button */
      background: "transparent",
      color: "#333",
      radius: "4px",
      fontSize: "0.95rem",
      padding: "4px 8px",
      hoverBg: "#f0f0f0",
      disabledOpacity: 0.5,
    },
  },
  weekdays: {
    base: {
      color: "#666",
      fontWeight: "700",
      transform: "uppercase",
      fontSize: "0.8rem",
      textTransform: "uppercase",
      textAlign: "center",
    },
    wrapper: {},
    weekday: {
      padding: "5px 0",
    },
  },
  tile: {
    base: {
      padding: "10px 0",
      radius: "4px",
      fontSize: "0.9rem",
      border: "1px solid #eee",
      height: "60px",
      textAlign: "center",
      position: "relative",
    },
    hoverBg: "",
    today: {
      outline: "2px solid #e0f2f1",
    },
    active: {
      background: "#1976d2",
      color: "#fff",
    },
    hasActive: {},
    range: {},
    rangeStart: {},
    rangeEnd: {},
    disabled: {
      color: "#bbb",
    },
  },
  views: {
    month: {
      tileMinH: "60px",
    },
    year: {
      tileMinH: "40px",
    },
    decade: {},
    century: {},
  },
};

function deepMerge(...sources) {
  const result = {};
  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    for (const key of Object.keys(src)) {
      const val = src[key];
      if (val && typeof val === "object" && !Array.isArray(val)) {
        result[key] = deepMerge(result[key] || {}, val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

function CalendarStyle(props) {
  const {
    onChange,
    value,
    activeStartDate,
    locale,
    tileContent,
    onActiveStartDateChange,
    view,
    customStyle,
  } = props;

  const mergedStyles = useMemo(
    () => deepMerge(PROJECT_DEFAULT_STYLE_CONFIG, customStyle || {}),
    [customStyle]
  );

  return (
    <CalendarSkin $styles={mergedStyles}>
      <Calendar
        onChange={onChange}
        value={value}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={onActiveStartDateChange}
        locale={locale || "vi-VN"}
        tileContent={tileContent}
        view={view || "month"}
      />
    </CalendarSkin>
  );
}

export default CalendarStyle;
