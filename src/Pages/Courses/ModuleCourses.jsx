import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

// Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";

// Breadcrumb
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { userData } from "../../store/getProfileData";
import CourseListTable from "./CoursesList/CourseTable/courseListTable";
import ModuleListTable from "./ModuleListTable";

const ModuleCourses = () => {
  document.title = "Modules | Quest ";
  const navigate = useNavigate();
  const { module_id } = useParams();

  const [Courses, setCourses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [univs, setUnivs] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState();
  const getCourses = async () => {
    setLoading(true);
    const courses = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/modules/select_module_courses.php",
      {
        module_id: module_id,
      }
    );
    //
    console.log(courses);

    setCourses(courses?.message);

    setLoading(false);
  };

  const showHideCourse = async (send_data) => {
    //
    const courses = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/modules/show_hide_module.php",
      JSON.stringify(send_data)
    );
    //
    if (courses.status == "success") {
      toast.success(courses.message);
      getCourses();
      // console.log("getCourses");
    } else if (courses.status == "error") {
      toast.error(courses.message);
    } else {
      toast.error("Something Went Error");
    }
  };

  const getUnivs = async () => {
    const selct_univs = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
    );
    setUnivs(selct_univs.message);
  };

  const [selectedUnivs, setSelectedUnivs] = useState(false);

  useEffect(() => {
    getCourses();
    getUnivs();
  }, []);
  const [filterGrades, setFilterGrades] = useState(false);
  const [selectGrades, setSelectGrades] = useState(false);
  const getFilterGrades = () => {
    setFilterGrades(
      univs?.filter((item) => item.university_id == selectedUnivs)[0]?.grades
    );
  };
  useEffect(() => {
    let arr = [];
    if (filteredCourses && filteredCourses.length)
      arr = filteredCourses.filter(
        (item) => item?.university_id == selectedUnivs
      );
    setCourses([...arr]);
    if (selectedUnivs) {
      getFilterGrades();
    } else {
      setFilterGrades(false);
      setCourses(filteredCourses);
    }
  }, [selectedUnivs]);

  const permissions = userData?.permissions;

  console.log(Courses, "Courses");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Module Courses"
            breadcrumbItem="Module Courses List"
          />
          {/* <div className="univs">
            {univs && univs.length
              ? univs.map((item, index) => {
                  return (
                    <span
                      className={
                        selectedUnivs &&
                        selectedUnivs.length &&
                        selectedUnivs == item?.university_id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        selectedUnivs == item?.university_id
                          ? setSelectedUnivs(false)
                          : setSelectedUnivs(item?.university_id)
                      }
                    >
                      {item?.university_name}
                    </span>
                  );
                })
              : null}
          </div> */}

          {/* <div className="univs">
            {filterGrades && filterGrades.length
              ? filterGrades.map((item, index) => {
                  return (
                    <span
                      className={
                        selectGrades &&
                        selectGrades.length &&
                        selectGrades == item?.grade_id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        selectGrades == item?.grade_id
                          ? setSelectGrades(false)
                          : setSelectGrades(item?.grade_id)
                      }
                    >
                      {item?.grade_name}
                    </span>
                  );
                })
              : null}
          </div> */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="position-relative">
                    <div className="modal-button mt-2">
                      <Row className="align-items-start">
                        <Col className="col-sm">
                          <div>
                            {permissions?.includes("*1_1") ||
                            permissions?.startsWith("1_1") ||
                            permissions == "all" ? (
                              <button
                                type="button"
                                className="btn btn-success mb-4"
                                data-bs-toggle="modal"
                                data-bs-target="#addCourseModal"
                                onClick={() => {
                                  navigate("add-course");
                                }}
                              >
                                <i className="mdi mdi-plus me-1"></i>
                                Add Course
                              </button>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div id="table-invoices-list">
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <ModuleListTable
                          Courses={Courses}
                          showHideCourse={showHideCourse}
                          getCourses={getCourses}
                        />
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default ModuleCourses;
