import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import fetchDataConstants from '../../store/constants/fetchDataConstants';
import selectFetch from '../../store/selectors/fetchData';

function HomePage() {
  const dispatch = useDispatch();
  const loading = useSelector(selectFetch.selectFetchLoading);
  const data = useSelector(selectFetch.selectFetchData);
  const error = useSelector(selectFetch.selectFetchError);

  // params data type condition
  // {
  //   "COL_NAME": "Data" // equal 
  //   "COL_NAME_like": "Data", // like
  //   "COL_NAME_between": "Data, Data", // between
  //   "COL_NAME_in": "Data, Data, Data", // in
  //   "limit": 50, // limit
  //   "offset": 0, // offset
  //   "order_by": "COL_NAME:desc,COL_NAME:asc" // order_by
  // }

  useEffect(() => {
    dispatch({ 
      type: fetchDataConstants.FETCH_DATA_START,
      payload: { 
        table: "SFISM4.R_WIP_TRACKING_T",
        // params: {  "SERIAL_NUMBER": "A5025671A$1000101_2050-IS7F320HNO03" }
        params: { "limit": 5 }
      }
    });
  }, [dispatch]);

  return (
    <div>
      <h1>Oracle Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default HomePage;