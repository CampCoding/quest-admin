import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

function EditTopic({
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

  const handleEdit = () => {
    setLoading(true);
    console.log(topicData);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/matching_qs/topics/edit_topic_name.php",
        {
          ...{
            unit_id: unitData?.unit_id,
            course_id: unitData?.course_id,
            new_topic_name: rowData?.topic_label,
            old_topic_name: topicData?.topic_label,
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
        <label htmlFor="">Topic name</label>
        <input
          type="text"
          value={rowData?.topic_label}
          onChange={(e) => {
            setRowData({ ...rowData, topic_label: e.target.value });
          }}
        />
      </div>
      <button className="btn btn-primary" onClick={() => handleEdit()}>
        Save
      </button>
    </div>
  );
}

export default EditTopic;
