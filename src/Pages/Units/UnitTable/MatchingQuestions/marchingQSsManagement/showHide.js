import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

function ShowHideQuestion({
  setSelectedUnit,
  selectedUnit,
  setSelectedCourse,
  selectedCourse,
  unitData,
  getFunction,
  questionData,
  setQuestionData,
}) {
  const [rowData, setRowData] = useState(questionData);
  const [loading, setLoading] = useState(false);

  const handleShowHide = () => {
    console.log(questionData);
    setLoading(true);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/matching_qs/update_ques_hidden.php",
        {
          ...{
            unit_id: unitData?.unit_id,
            course_id: unitData?.course_id,
            matching_header_id: questionData?.matching_header_id,
            hidden_value: rowData?.hidden == "yes" ? "no" : "yes", // yes , no
          },
        }
      )
      .then((res) => {
        if (res?.status == "success") {
          if (getFunction) {
            getFunction();
          }
          setQuestionData(null);
          getFunction();
          toast.success(res?.message);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div style={{ padding: "30px" }} className="primaryTopic">
      <div className="columnDiv">
        <h1>Are You Sure ?</h1>
      </div>
      <button className="btn btn-primary" onClick={() => handleShowHide()}>
        Save
      </button>
    </div>
  );
}

export default ShowHideQuestion;
