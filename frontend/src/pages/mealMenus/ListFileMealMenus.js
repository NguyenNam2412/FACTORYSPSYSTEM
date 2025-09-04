import { useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import mealMenusConstants from "@store/constants/mealMenusConstants";
import mealMenusSelectors from "@store/selectors/mealMenusSelectors";

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
        payload: file,
      });
    }

    event.target.value = "";
  };

  const deletedFileMealMenus = (id) => {
    dispatch({
      type: mealMenusConstants.DELETE_MEAL_MENUS_REQUEST,
      payload: id,
    });
  };

  const isUploading = uploadStatus === "loading";

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      {/* upload button */}
      <div
        onClick={() => {
          if (!isUploading) {
            fileInputRef.current.click();
          }
        }}
        style={{
          border: "1px dashed #ccc",
          padding: "10px",
          marginBottom: "5px",
          textAlign: "center",
          cursor: isUploading ? "not-allowed" : "pointer",
          backgroundColor: isUploading ? "#f5f5f5" : "transparent",
          color: isUploading ? "#999" : "#000",
        }}
      >
        {isUploading
          ? "Đang upload..."
          : isUploading === "failure"
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
          key={file.fileId}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "5px",
          }}
        >
          <div>{file.fileName}</div>
          <button onClick={() => deletedFileMealMenus(file.fileId)}>
            delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ListFileMealMenus;
