import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import mealMenusConstants from "@store/constants/mealMenusConstants";
import mealRegConstants from "@store/constants/mealRegConstants";
import mealMenusSelectors from "@store/selectors/mealMenusSelectors";
import mealRegSelectors from "@store/selectors/mealRegSelectors";

import CalendarView from "@components/Calendar/CalendarView";

import { formatDate } from "@utils/dateTime/formatDate";

const disabledDates = [];

function groupMenuByDate(menus) {
  return menus.reduce((acc, item) => {
    const date = item.MENU_DATE; // format "dd/MM/yyyy"
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
}

function MealMenus() {
  const dispatch = useDispatch();

  const { mealMenus } = useSelector(
    (state) => ({
      mealMenus: mealMenusSelectors.selectListMealMenus(state),
    }),
    shallowEqual
  );

  // Group menus
  const menusByDate = useMemo(() => groupMenuByDate(mealMenus), [mealMenus]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkedDays, setCheckedDays] = useState([]);

  useEffect(() => {
    dispatch({
      type: mealMenusConstants.GET_LIST_MEAL_MENUS_REQUEST,
    });
  }, [dispatch]);

  const todayKey = formatDate.toLocalDateStr(selectedDate);
  const todayMenus = menusByDate[todayKey] || [];

  const handleCheck = (date) => {
    const key = formatDate.toLocalDateStr(date);
    let newCheckedDays;
    if (checkedDays.includes(key)) {
      newCheckedDays = checkedDays.filter((day) => day !== key);
    } else {
      newCheckedDays = [...checkedDays, key];
    }
    console.log(newCheckedDays);
    setCheckedDays(newCheckedDays);
  };

  const isDisabled = (date) => {
    const today = new Date();
    const currentHour = today.getHours();

    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      return true;
    }

    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return true;
    }

    if (d.getDay() === 0) return true;

    const formatted = formatDate.toLocalDateStr(d); // dd/mm/yyyy
    if (disabledDates.includes(formatted)) return true;

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (
      currentHour >= 15 &&
      d.getDate() === tomorrow.getDate() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getFullYear() === tomorrow.getFullYear() &&
      d.getDay() !== 0
    ) {
      return true;
    }

    return false;
  };

  const titleContent = ({ date }) => {
    const key = formatDate.toLocalDateStr(date);
    return (
      <>
        {menusByDate[key] && <div className="calendar-dot"></div>}

        <input
          type="checkbox"
          className="calendar-checkbox"
          checked={!!checkedDays.includes(key)}
          onChange={() => handleCheck(date)}
          disabled={isDisabled(date)}
        />
      </>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* calendar */}
      <div style={{ flex: 1, padding: "10px", borderBottom: "1px solid #ccc" }}>
        <CalendarView
          onChange={(date) => setSelectedDate(date)}
          value={selectedDate}
          locale="vi-VN"
          tileContent={titleContent}
        />
      </div>

      {/* menus */}
      <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        <h3>Thực đơn ngày {todayKey}</h3>
        {todayMenus.length > 0 ? (
          <ul>
            {todayMenus.map((item) => (
              <li key={item.MENU_ID}>
                <b>{item.DISH_TYPE.split("\r\n")[0]}</b>: {item.NAME_VI}{" "}
                <i style={{ display: !item.NAME_EN && "none" }}>
                  ({item.NAME_EN})
                </i>
              </li>
            ))}
          </ul>
        ) : (
          <div>Không có thực đơn</div>
        )}
      </div>
    </div>
  );
}

export default MealMenus;
