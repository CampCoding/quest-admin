import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CourseGradesQBank.css"; // Import CSS file for styling
import { Modal, Loader } from "rsuite";
import { toast } from "react-toastify";
import { MenuItem, Select } from "@mui/material";
import { CloseButton } from "reactstrap";

const GradeCourseList = ({
  grades,
  courses,
  onUnassignGrade,
  onUnassignCourse,
  loading,
}) => {
  return (
    <>
      {
        <div className="course-grades-container">
          {!loading ? (
            <>
              <div className="grades">
                <h2>Grades</h2>
                {grades.map((grade) => (
                  <div key={grade.grade_id} className="grade">
                    <div className="grade-info">
                      <div className="grade-name">{grade.grade_name}</div>
                      <div className="university-name">
                        University: {grade.university_name}
                      </div>
                    </div>
                    <button
                      className="unassign-btn"
                      onClick={() => onUnassignGrade(grade.grade_id)}
                    >
                      Unassign
                    </button>
                  </div>
                ))}
              </div>
              <div className="courses">
                <h2>Courses</h2>
                {courses.map((course) => (
                  <div className="course" key={course.course_id}>
                    <img
                      className="course-img"
                      src={course.course_photo_url}
                      alt="Course Image"
                    />
                    <div className="course-details">
                      <div className="course-name">{course.course_name}</div>
                    </div>
                    <button
                      className="unassign-btn"
                      onClick={() => onUnassignCourse(course.course_id)}
                    >
                      Unassign
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Loader size="lg" />
          )}
        </div>
      }
    </>
  );
};

// Usage
const CourseGradesQBank = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showUnassignGradeModal, setShowUnassignGradeModal] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [showUnassignCourseModal, setShowUnassignCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const getGradesCourses = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/qbank/select_qbank_data.php"
      )
      .then((response) => {
        const data = response.message;
        setGrades(data.grades);
        setCourses(data.courses);
        setLoading(false); // Data fetching completed, set loading to false
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Data fetching failed, set loading to false
      });
  };
  useEffect(() => {
    getGradesCourses();
  }, []);

  const handleUnassignGrade = (gradeId) => {
    setSelectedGradeId(gradeId);
    setShowUnassignGradeModal(true);
  };

  const handleUnassignCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setShowUnassignCourseModal(true);
  };

  const confirmUnassignGrade = () => {
    // Send a request to unassign the grade
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/qbank/unassign_grade.php",
        { grade_id: selectedGradeId }
      )
      .then((response) => {
        // Handle successful unassign

        if (response.status == "success") {
          console.log("Grade unassigned successfully:", response.data);
          // Remove the unassigned grade from the list
          setGrades((prevGrades) =>
            prevGrades.filter((grade) => grade.grade_id !== selectedGradeId)
          );
          setShowUnassignGradeModal(false);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error unassigning grade:", error);
        setShowUnassignGradeModal(false);
      });
  };

  const confirmUnassignCourse = () => {
    // Send a request to unassign the course
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/qbank/unassign_bank.php",
        { course_id: selectedCourseId }
      )
      .then((response) => {
        // Handle successful unassign
        // Remove the unassigned course from the list
        if (response.status == "success") {
          setCourses((prevCourses) =>
            prevCourses.filter(
              (course) => course.course_id !== selectedCourseId
            )
          );
          setShowUnassignCourseModal(false);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error unassigning course:", error);
        setShowUnassignCourseModal(false);
      });
  };

  const assignGrade = () => {
    // Send a request to unassign the course
    setLoader("grade");
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/qbank/assign_grade.php",
        { grade_id: selecedGrade }
      )
      .then((response) => {
        // Handle successful unassign
        // Remove the unassigned course from the list
        if (response.status == "success") {
          getGradesCourses();
          setSelectedGrade(null);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error unassigning course:", error);
        setShowUnassignCourseModal(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const assignCourse = () => {
    // Send a request to unassign the course
    setLoader("course");
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/qbank/assign_bank.php",
        { course_id: selectedCourse }
      )
      .then((response) => {
        // Handle successful unassign
        // Remove the unassigned course from the list
        if (response.status == "success") {
          getGradesCourses();
          setSelectCourse(null);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error unassigning course:", error);
        setShowUnassignCourseModal(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const [assigGrades, setAssignGrades] = useState(false);
  const [assignCourses, setAssignCourses] = useState(false);
  const [modalCourses, setModalCourses] = useState([]);
  const [selectedCourse, setSelectCourse] = useState("");
  const [universities, setUniversities] = useState([]);
  const [selecteduniversity, setSelecteduniversity] = useState("");
  const [modalGrades, setModalGrades] = useState([]);
  const [selecedGrade, setSelectedGrade] = useState("");
  const [loader, setLoader] = useState(false);
  const getUniversities = () => {
    setLoader("univ");
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/import_qs/select_universities_grade.php"
      )
      .then((res) => {
        if (Array.isArray(res.message)) setUniversities(res.message);
        // setSelecteduniversity(res?.message[0]?.university_id);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoader(false);
      });
  };
  const getCourses = async () => {
    try {
      setLoader("course");
      const courses = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/import_qs/select_courses.php",
        {
          grade_id: selecedGrade,
        }
      );
      // setCourses([...courses]);
      let pushedCourses = courses.filter(
        (item) => item.grade_id == selecedGrade
      );
      setModalCourses((prev) => pushedCourses);
      setLoader("false");
    } catch (err) {
      setLoader("false");

      return err;
    }
    // setSelectCourse(pushedCourses[0]?.course_id);
  };
  const getGrades = () => {
    setLoader("grade");
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/import_qs/select_universities_grade.php"
      )
      .then((res) => {
        if (Array.isArray(res.message)) {
          let AllGrades = [...res.message];
          let newGrade = AllGrades.filter(
            (item) => item.university_id == selecteduniversity
          );
          let grades = [newGrade[0]?.grades];
          setModalGrades((prev) => grades[0]);
          setLoader(false);

          // setSelectedGrade(grades[0].grade_id);
        }
      })
      .catch((err) => err)
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (selecteduniversity) {
      setModalGrades((prev) => []);
      setSelectedGrade(null);
      getGrades();
    }
  }, [selecteduniversity]);
  useEffect(() => {
    if (assigGrades || assignCourses) getUniversities();
    else {
      setModalCourses(null);
      setModalGrades(null);
    }
  }, [assigGrades, assignCourses]);
  useEffect(() => {
    if (selecedGrade && assigGrades) {
      assignGrade();
    } else if (selectedCourse && assignCourses) {
      assignCourse();
    } else if (!assigGrades && !assignCourses) {
      setModalCourses((prev) => []);
      setModalGrades((prev) => []);
      setSelecteduniversity(null);
      setSelectedGrade(null);
      setSelectCourse(null);
    }
  }, [selecedGrade, selectedCourse, assigGrades, assignCourses]);

  useEffect(() => {
    if (selecedGrade && assignCourses) {
      setModalCourses((prev) => []);

      getCourses();
    }
  }, [selecedGrade]);
  return (
    <div
      className="course-grades-container"
      style={{ flexDirection: "column", margin: "80px 0px 0 0" }}
    >
      <h1>Grades and Courses</h1>
      <div className="rowDiv">
        <button
          className="btn btn-primary"
          onClick={() => setAssignCourses(true)}
        >
          Assign Courses
        </button>
        <button
          className="btn btn-success"
          onClick={() => setAssignGrades(true)}
        >
          Assign Grades
        </button>
      </div>
      {
        <>
          <GradeCourseList
            loading={loading}
            grades={grades}
            courses={courses}
            onUnassignGrade={handleUnassignGrade}
            onUnassignCourse={handleUnassignCourse}
          />
          <Modal
            show={showUnassignGradeModal}
            open={showUnassignGradeModal}
            onHide={() => setShowUnassignGradeModal(false)}
            size="sm"
          >
            <Modal.Header>
              <Modal.Title>Confirm Unassign Grade</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to unassign this grade?
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-default"
                onClick={() => setShowUnassignGradeModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmUnassignGrade}>
                Unassign
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            open={showUnassignCourseModal}
            show={showUnassignCourseModal}
            onHide={() => setShowUnassignCourseModal(false)}
            size="sm"
          >
            <Modal.Header>
              <Modal.Title>Confirm Unassign Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to unassign this course?
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-default"
                onClick={() => setShowUnassignCourseModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmUnassignCourse}
              >
                Unassign
              </button>
            </Modal.Footer>
          </Modal>

          {/* -=============================- */}

          <Modal open={assigGrades} show={assigGrades}>
            <Modal.Body>
              {/* {loading == "univ" ? (
            <Loader />
          ) : ( */}
              <CloseButton
                onClick={() => setAssignGrades(false)}
                style={{ marginLeft: "auto" }}
              />
              <div>
                {" "}
                <label style={{ fontSize: "22px" }} htmlFor="">
                  Universities
                </label>
                <Select
                  style={{
                    width: "100%",
                    borderRadius: "4px",
                    margin: "10px 0",
                  }}
                  type="text"
                  name="unit_id"
                  id="unit_id"
                  value={selecteduniversity}
                  placeholder="Choose Unit"
                  onChange={(e) => {
                    setSelecteduniversity(e.target.value);
                  }}
                  // onChange={(e) => setSelectedUnit(e.target.value)}
                  required
                >
                  {universities &&
                    universities?.map((item, index) => {
                      return (
                        <MenuItem value={item.university_id} key={index}>
                          {item?.university_name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </div>
              {/* )} */}

              {loader == "grade" ? (
                <div>
                  <Loader />
                </div>
              ) : modalGrades && modalGrades?.length ? (
                <div>
                  {" "}
                  <label style={{ fontSize: "22px" }} htmlFor="">
                    Grades
                  </label>
                  <Select
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                    type="text"
                    name="unit_id"
                    id="unit_id"
                    value={selecedGrade}
                    placeholder="Choose Unit"
                    onChange={(e) => {
                      setSelectedGrade(e.target.value);
                    }}
                    // onChange={(e) => setSelectedUnit(e.target.value)}
                    required
                  >
                    {modalGrades &&
                      modalGrades?.map((item, index) => {
                        if (
                          !grades?.filter(
                            (fi_item) => fi_item?.grade_id == item.grade_id
                          )?.length
                        )
                          return (
                            <MenuItem value={item.grade_id} key={index}>
                              {item?.grade_name}
                            </MenuItem>
                          );
                      })}
                  </Select>
                </div>
              ) : null}

              {/* {console.log(selectedquestiondata)} */}
            </Modal.Body>
          </Modal>

          <Modal open={assignCourses} show={assignCourses}>
            <Modal.Body>
              <CloseButton
                onClick={() => setAssignCourses(false)}
                style={{ marginLeft: "auto" }}
              />
              <div>
                {" "}
                <label style={{ fontSize: "22px" }} htmlFor="">
                  Universities
                </label>
                <Select
                  style={{
                    width: "100%",
                    borderRadius: "4px",
                    margin: "10px 0",
                  }}
                  type="text"
                  name="unit_id"
                  id="unit_id"
                  value={selecteduniversity}
                  placeholder="Choose Unit"
                  onChange={(e) => {
                    setSelecteduniversity(e.target.value);
                  }}
                  // onChange={(e) => setSelectedUnit(e.target.value)}
                  required
                >
                  {universities &&
                    universities?.map((item, index) => {
                      return (
                        <MenuItem value={item.university_id} key={index}>
                          {item?.university_name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </div>
              {/* )} */}

              {loader == "grade" ? (
                <div>
                  <Loader />
                </div>
              ) : modalGrades && modalGrades?.length ? (
                <div>
                  {" "}
                  <label style={{ fontSize: "22px" }} htmlFor="">
                    Grades
                  </label>
                  <Select
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                    type="text"
                    name="unit_id"
                    id="unit_id"
                    value={selecedGrade}
                    placeholder="Choose Unit"
                    onChange={(e) => {
                      setSelectedGrade(e.target.value);
                    }}
                    // onChange={(e) => setSelectedUnit(e.target.value)}
                    required
                  >
                    {modalGrades &&
                      modalGrades?.map((item, index) => {
                        return (
                          <MenuItem value={item.grade_id} key={index}>
                            {item?.grade_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </div>
              ) : null}

              {loader == "course" ? (
                <div>
                  <Loader />
                </div>
              ) : modalCourses && modalCourses?.length ? (
                <div>
                  {" "}
                  <label style={{ fontSize: "22px" }} htmlFor="">
                    Courses
                  </label>
                  <Select
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                    type="text"
                    name="unit_id"
                    id="unit_id"
                    value={selectedCourse}
                    placeholder="Choose Unit"
                    onChange={(e) => {
                      setSelectCourse(e.target.value);
                    }}
                    // onChange={(e) => setSelectedUnit(e.target.value)}
                    required
                  >
                    {modalCourses &&
                      modalCourses?.map((item, index) => {
                        if (
                          !courses?.filter(
                            (fi_item) => fi_item?.course_id == item.course_id
                          )?.length
                        )
                          return (
                            <MenuItem value={item.course_id} key={index}>
                              {item?.course_name}
                            </MenuItem>
                          );
                      })}
                  </Select>
                </div>
              ) : null}
              {/* {console.log(selectedquestiondata)} */}
            </Modal.Body>
          </Modal>
        </>
      }
    </div>
  );
};

export default CourseGradesQBank;
