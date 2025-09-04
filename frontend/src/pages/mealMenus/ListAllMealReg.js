import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

// import dayjs from "@utils/dateTime/dayjsConfig";
import { formatDate } from "@utils/dateTime/formatDate";

import mealRegConstants from "@store/constants/mealRegConstants";
import mealRegSelectors from "@store/selectors/mealRegSelectors";

import DatePicker from "@components/Calendar/DatePicker";
import StyledTable from "@components/Table";

const columns = [
  {
    key: "index",
    dataIndex: "index",
    title: "STT",
    width: "5%",
    sticky: "col",
    align: "center",
  }, // <- sticky cột đầu
  { key: "REG_DATE", dataIndex: "REG_DATE", title: "Ngày tháng", width: "15%" },
  { key: "EMP_ID", dataIndex: "EMP_ID", title: "Mã nhân viên", width: "15%" },
  {
    key: "FULL_NAME",
    dataIndex: "FULL_NAME",
    title: "Tên nhân viên",
    width: "25%",
  },
  {
    key: "DEPARTMENT_ID",
    dataIndex: "DEPARTMENT_ID",
    title: "Bộ phận",
    width: "15%",
  },
  { key: "NOTE", dataIndex: "NOTE", title: "Ghi chú", width: "25%" },
];

function ListAllMealReg() {
  const dispatch = useDispatch();

  const { allMealReg } = useSelector(
    (state) => ({
      allMealReg: mealRegSelectors.selectAllMealReg(state),
    }),
    shallowEqual
  );

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    dispatch({
      type: mealRegConstants.GET_ALL_REG_MEAL_REQUEST,
      payload: formatDate.toEpochTime(selectedDate),
    });
  }, [dispatch, selectedDate]);

  return (
    <div>
      <div style={{ maxWidth: "200vh" }}>
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div style={{ marginTop: "20px", maxWidth: "500px" }}>
        <StyledTable
          columns={columns}
          data={[
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
            ...allMealReg,
          ]}
        />
      </div>
    </div>
  );
}

export default ListAllMealReg;
