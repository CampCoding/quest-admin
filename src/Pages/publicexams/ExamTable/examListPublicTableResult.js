import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import { ExamData } from "../../../CommonData/Data/Exams";
import moment from "moment";
import axios from "axios";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ExamQuestionStatistics from "./examQuestionStatisticsSecond";
import { Loader } from "rsuite";

const ExamListPublicTableResult = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 1, label: "Examined Students" },
    { id: 2, label: "Statistics" },
    { id: 3, label: "Students Answers" },
  ]);
  const location = useLocation();

  const getExams = () => {
    // "Examined Students"
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/Exams/select_genral_exam_degrees.php",
        {
          course_id: location?.state?.course_id,
          exam_id: location?.state?.exam_id,
        }
      )
      .then((res) => {
        setExams(res.message);
        setStudentsIds(
          res.message?.map((item) => ({
            id: item?.student_id,
            name: item?.student_name,
            phone: item?.phone,
          }))
        );
      })
      .catch((err) => setExams([]));
  };

  const [selected_tab, setSelectedTab] = useState("Examined Students");
  const [student_ids, setStudentsIds] = useState([]);
  useEffect(() => {
    getExams();
    if (selected_tab == "Students Answers") {
      navigate("/indvidualResultsList", {
        state: {
          exam_id: location?.state?.exam_id,
          student_ids: student_ids,
        },
      });
    }
  }, [selected_tab]);
  // location?.state?.exam_id
  const ex_columns = [
    {
      Header: "Student ID",
      accessor: "student_id",
      Filter: false,
    },
    {
      Header: "student_name",
      accessor: "student_name",
      //   Filter: false,
    },
    {
      Header: "student_image",
      Cell: (cell) => {
        return (
          <span>
            <img src={cell.cell.row.original.student_avater_url} alt="" />
          </span>
        );
      },
      Filter: false,
    },
    {
      Header: "university_name",
      accessor: "university_name",
      //   Filter: false,
    },
    {
      Header: "grade_title",
      accessor: "grade_title",
      //   Filter: false,
    },
    {
      Header: "student_phone",
      accessor: "phone",
      //   Filter: false,
    },

    {
      Header: "date",
      accessor: "date",
      Filter: false,
    },
    {
      Header: "Score",
      accessor: "score",
      Filter: false,
    },
    {
      Header: "Chooses",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              navigate("/indvidualResults", {
                state: {
                  student_id: cell.cell.row.original?.student_id,
                  exam_id: location?.state?.exam_id,
                  student_ids: student_ids,
                },
              });
            }}
          >
            View
          </button>
        );
      },
    },
  ];

  const columns = [
    {
      Header: "Student ID",
      accessor: "student_id",
      Filter: false,
    },
    {
      Header: "student_image",
      Cell: (cell) => {
        return (
          <span>
            <img src={cell.cell.row.original?.student_avater_url} alt="" />
          </span>
        );
      },
      Filter: false,
    },
    {
      Header: "student_name",
      accessor: "student_name",
      //   Filter: false,
    },

    {
      Header: "student_phone",
      accessor: "phone",
      //   Filter: false,
    },
    {
      Header: "Chooses",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              navigate("/indvidualResults", {
                student_id: cell.cell.row.original?.student_id,
                exam_id: ExamData?.exam_id,
                student_ids: student_ids,
              });
            }}
          >
            View
          </button>
        );
      },
    },
  ];

  return (
    <>
      <>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="Results" breadcrumbItem="Results List" />
            <div className="tabs">
              {tabs.map((item, index) => {
                return (
                  <button
                    className={
                      item.label == selected_tab ? "btn btn-success" : "btn"
                    }
                    onClick={() => setSelectedTab(item.label)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <Row>
              <Col lg={12}>
                <Card
                  className={
                    selected_tab == "Statistics" ? "Statistics_card" : ""
                  }
                >
                  <CardBody>
                    <div id="table-invoices-list">
                      {selected_tab == "Examined Students" ? (
                        <>
                          {" "}
                          {!exams ? (
                            <Loader />
                          ) : exams.length ? (
                            <TableContainer
                              columns={ex_columns}
                              data={exams}
                              isGlobalFilter={true}
                              customPageSize={10}
                              className="Invoice table"
                            />
                          ) : null}
                        </>
                      ) : selected_tab == "Statistics" ? (
                        <>
                          <ExamQuestionStatistics />
                        </>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    </>
  );
};

export default ExamListPublicTableResult;
