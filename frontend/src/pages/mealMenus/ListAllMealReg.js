import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { formatDate } from "@utils/dateTime/formatDate";
import { exportTableToExcel } from "@utils/exportFile/exportExcel";

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
    sticky: "col", // <- sticky cột đầu
    align: "center",
  },
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

  const tableData = useMemo(() => {
    const base = allMealReg || [];
    return base.map((item, idx) => ({ ...item, index: idx + 1 }));
  }, [allMealReg]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div style={{ maxWidth: "200vh" }}>
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        {allMealReg.length > 0 && (
          <div>
            <button
              onClick={() =>
                exportTableToExcel({
                  data: tableData,
                  columns,
                  filename: `MealReg_${formatDate.toLocalDateStr(
                    selectedDate
                  )}.xlsx`,
                  columnWidths: [6, 18, 18, 30, 18, 30],
                })
              }
              style={{ cursor: "pointer" }}
            >
              Export
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: "20px", maxWidth: "500px" }}>
        <StyledTable columns={columns} data={tableData} />
      </div>
    </div>
  );
}

export default ListAllMealReg;
