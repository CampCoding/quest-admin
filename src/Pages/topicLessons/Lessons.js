/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";

import axios from "axios";
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";

import Flash_Cards from "../InteractiveTopics/flashcards";
import Tweets from "../InteractiveTopics/tweets";
import WrittenQuestions from "../InteractiveTopics/writtenquestion";

import { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import Topic_Flash_Cards from "../InteractiveTopics/flashcards";
import TopicTweets from "../InteractiveTopics/tweets";
import TopicWrittenQuestions from "../InteractiveTopics/writtenquestion";
import TopicCases from "../InteractiveTopics/cases";

// import CourseListTable from "../CourseTable/courseListTable";

const TopicLessons = () => {
  document.title = "Courses | Quest ";

  const location = useLocation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("Topics");
  const [type, setType] = useState("FlashCards");

  document.title = title + " | Quest ";

  const buttons = [
    { type: "FlashCards", title: "Flash Cards" },
    // { type: "Tweets", title: "Tweets" },
    // { type: "writtenquestion", title: "Written Questions" },
    // { type: "cases", title: "Cases" },
    // { type: "mcqquestion", title: "MCQ Questions" },
  ];

  const [Courses, setCourses] = useState(false);
  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };

  useEffect(() => {
    getCourses();
  }, []);

  const [selectedCourse, setSelectedCourse] = useState(false);
  const [Units, setUnits] = useState(false);

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
    getUnits();
  }, [selectedCourse]);

  const unitData = location?.state?.unitData?.unit_id;
  const courseData = location?.state?.coursedata?.course_id;

  // const unitdata = location?.state;

  if (!location?.state) {
    return navigate(-1);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="header-btns">
            {buttons.map((buttonData, index) => (
              <button
                key={index}
                className={`btn btn-success ${
                  type === buttonData.type ? "btn-danger" : ""
                }`}
                onClick={() => {
                  setType(buttonData.type);
                  setTitle(buttonData.title);
                }}
              >
                {buttonData.title}
              </button>
            ))}
          </div>
          <div id="table-invoices-list">
            {type == "FlashCards" ? (
              <Topic_Flash_Cards
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "Tweets" ? (
              <TopicTweets
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "writtenquestion" ? (
              <TopicWrittenQuestions
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "cases" ? (
              <TopicCases
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : null}
          </div>
        </Container>

        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default TopicLessons;
