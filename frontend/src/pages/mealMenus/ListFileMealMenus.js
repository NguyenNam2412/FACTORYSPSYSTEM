import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import mealMenusConstants from "../../store/constants/mealMenusConstants";
import mealMenusSelectors from "../../store/selectors/mealMenusSelectors";

function ListFileMealMenus() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { listFileMealMenus, uploadStatus } = useSelector(
    (state) => ({
      listFileMealMenus: mealMenusSelectors.selectListFilesMealMenus(state),
      uploadStatus: mealMenusSelectors.selectMealMenusUploadStatus(state),
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch({
      type: mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_REQUEST,
    });
  }, [dispatch]);

  const uploadFileMealMenus = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch({
        type: mealMenusConstants.UPLOAD_MEAL_MENUS_REQUEST,
        payload: { file },
      });
    }
    event.target.value = "";
  };

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      {/* upload button */}
      <div
        onClick={() => {
          if (uploadStatus !== "loading") fileInputRef.current.click();
        }}
        style={{
          border: "1px dashed #ccc",
          padding: "10px",
          marginBottom: "5px",
          textAlign: "center",
          cursor: uploadStatus === "loading" ? "not-allowed" : "pointer",
          backgroundColor:
            uploadStatus === "loading" ? "#f5f5f5" : "transparent",
          color: uploadStatus === "loading" ? "#999" : "#000",
        }}
      >
        {uploadStatus === "loading"
          ? "Đang upload..."
          : uploadStatus === "failure"
          ? "Upload thất bại!"
          : "+ Upload"}
      </div>

      {/* Input file */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadFileMealMenus}
        style={{ display: "none" }}
      />

      {/* list file */}
      {listFileMealMenus.map((file) => (
        <div
          key={file.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "5px",
          }}
        >
          {file.fileName}
        </div>
      ))}
    </div>
  );
}

export default ListFileMealMenus;
