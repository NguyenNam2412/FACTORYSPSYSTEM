import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import dayjs from "@utils/dateTime/dayjsConfig";
import { formatDate } from "@utils/dateTime/formatDate";

import mealMenusConstants from "@store/constants/mealMenusConstants";
import mealRegConstants from "@store/constants/mealRegConstants";
import mealMenusSelectors from "@store/selectors/mealMenusSelectors";
import mealRegSelectors from "@store/selectors/mealRegSelectors";

import CalendarView from "@components/Calendar/CalendarView";

const disabledDates = [];

function MealMenus() {
  const dispatch = useDispatch();

  const { mealMenus, myMealReg } = useSelector(
    (state) => ({
      mealMenus: mealMenusSelectors.selectListMealMenus(state),
      myMealReg: mealRegSelectors.selectMyRegMeal(state),
    }),
    shallowEqual
  );

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [regList, setRegList] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    setRegList(myMealReg);
  }, [myMealReg]);

  useEffect(() => {
    setNote(
      regList.find((item) =>
        dayjs(item.REG_DATE, "DD/MM/YYYY").isSame(dayjs(selectedDate), "day")
      )?.NOTE || ""
    );
  }, [regList, selectedDate]);

  useEffect(() => {
    dispatch({
      type: mealMenusConstants.GET_LIST_MEAL_MENUS_REQUEST,
    });
    dispatch({
      type: mealRegConstants.GET_MY_REG_MEAL_REQUEST,
    });
  }, [dispatch]);

  const todayKey = formatDate.toLocalDateStr(selectedDate);
  const todayMenus = mealMenus[todayKey] || [];

  const checkedDays = regList.map((item) => item.REG_DATE);

  const handleCheck = (date) => {
    const key = formatDate.toLocalDateStr(date);
    const checked = !checkedDays.includes(key);

    let newList;
    if (checked) {
      newList = [...regList, { REG_DATE: key, QTY: 1, NOTE: "" }];
    } else {
      newList = regList.filter((item) => item.REG_DATE !== key);
    }
    setRegList(newList);
    dispatch({
      type: mealRegConstants.UPDATE_REG_MEAL_REQUEST,
      payload: newList,
    });
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

  const handleSaveNote = (dateKey, noteText) => {
    const newList = regList.map((item) =>
      item.REG_DATE === dateKey ? { ...item, NOTE: noteText } : item
    );
    setRegList(newList);
    dispatch({
      type: mealRegConstants.UPDATE_REG_MEAL_REQUEST,
      payload: newList,
    });
    setNote(""); // reset input
  };

  const titleContent = ({ date }) => {
    const key = formatDate.toLocalDateStr(date);
    return (
      <>
        {mealMenus[key] && <div className="calendar-dot"></div>}

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
      <div
        style={{
          flex: 1,
          maxWidth: "800px",
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <CalendarView
          onChange={(date) => setSelectedDate(date)}
          value={selectedDate}
          locale="vi-VN"
          tileContent={titleContent}
        />
      </div>

      {/* menus */}
      <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <h3 style={{ margin: 0 }}>Thực đơn ngày {todayKey}</h3>

          {((todayMenus.length > 0 &&
            checkedDays.includes(todayKey) &&
            !isDisabled(formatDate.parseLocalDate(todayKey))) ||
            note.length > 0) && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <textarea
                id="noteInput"
                maxLength={50}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú..."
                disabled={
                  todayMenus.length > 0 &&
                  checkedDays.includes(todayKey) &&
                  !isDisabled(formatDate.parseLocalDate(todayKey))
                }
                rows={2}
                style={{
                  width: "200px",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  resize: "none",
                }}
              />
              {todayMenus.length > 0 &&
                checkedDays.includes(todayKey) &&
                !isDisabled(formatDate.parseLocalDate(todayKey)) && (
                  <button
                    onClick={() => handleSaveNote(todayKey, note)}
                    disabled={!note.trim()}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: note.trim() ? "pointer" : "not-allowed",
                      height: "40px",
                    }}
                  >
                    Save
                  </button>
                )}
            </div>
          )}
        </div>

        {todayMenus.length > 0 ? (
          <div>
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
          </div>
        ) : (
          <div>Không có thực đơn</div>
        )}
      </div>
    </div>
  );
}

export default MealMenus;
