import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

function ShowHideTopic({
  setSelectedUnit,
  selectedUnit,
  setSelectedCourse,
  selectedCourse,
  unitData,
  getFunction,
  topicData,
  setTopicData,
}) {
  const [rowData, setRowData] = useState(topicData);
  const [loading, setLoading] = useState(false);

  const handleShowHide = () => {
    setLoading(true);
    console.log(topicData);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/matching_qs/topics/show_hide_topic.php",
        {
          ...{
            unit_id: unitData?.unit_id,
            course_id: unitData?.course_id,
            topic_label: rowData?.topic_label,
            status: rowData?.hidden == "yes" ? "no" : "yes", // yes , no
          },
        }
      )
      .then((res) => {
        if (res?.status == "success") {
          if (getFunction) {
            getFunction();
          }
          setTopicData(null);
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

export default ShowHideTopic;
