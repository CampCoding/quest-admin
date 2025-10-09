import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

function CopyQuestion({
  setSelectedUnit,
  selectedUnit,
  setSelectedCourse,
  selectedCourse,
  unitData,
  getFunction,
  questionData,
  setQuestionData,
  selectedTopic,
  setSelectedTopic,
}) {
  const [courses, setCourses] = useState();
  const [units, setUnits] = useState();
  const [topics, setTopics] = useState();
  const [loading, setLoading] = useState(false);
  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };

  const getUnits = async () => {
    const send_data = {
      course_id: selectedCourse,
    };
    try {
      const units = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/courses/select_course_units.php",
        send_data
      );
      setUnits([...units]);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCourses();
  }, []);
  useEffect(() => {
    getUnits();
  }, [selectedCourse]);

  const getTopics = async () => {
    const topic = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/true_false_ques/topics/select_topics.php",
      {
        course_id: selectedCourse,
        unit_id: selectedUnit,
      }
    );
    if (topic.message) {
      setTopics([...topic.message]);
    } else {
      setTopics([]);
    }
  };

  useEffect(() => {
    if (selectedUnit) getTopics();
  }, [selectedUnit]);
  const handleCopy = () => {
    setLoading(true);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/true_false_ques/topics/make_copy_from_ques.php",
        {
          ...{
            question_id: questionData?.qs_id,
            new_unit_id: selectedUnit,
            new_course_id: selectedCourse,
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
        <label htmlFor="">Courses</label>
        <ReactSelect
          onChange={(e) => setSelectedCourse(e?.value)}
          options={courses?.map((item) => ({
            label: `${item?.university_name} - ${item?.grade_name} - ${item?.course_name}`,
            value: item?.course_id,
          }))}
        ></ReactSelect>
      </div>
      <div className="columnDiv">
        <label htmlFor="">Units</label>
        <ReactSelect
          onChange={(e) => setSelectedUnit(e?.value)}
          options={units?.map((item) => ({
            label: item?.unit_name,
            value: item?.unit_id,
          }))}
        ></ReactSelect>
      </div>

      {/* <div className="columnDiv">
        <label htmlFor="">Topics</label>
        <ReactSelect
          onChange={(e) => setSelectedTopic(e?.value)}
          options={topics?.map((item) => ({
            label: item?.topic_label,
            value: item?.topic_label,
          }))}
        ></ReactSelect>
      </div> */}
      <button className="btn btn-primary" onClick={() => handleCopy()}>
        Copy
      </button>
    </div>
  );
}

export default CopyQuestion;
