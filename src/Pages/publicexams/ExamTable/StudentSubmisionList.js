import { Breadcrumbs } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Loader } from "rsuite";
import { Chart } from "react-google-charts";

const StudentSubmisionList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestion] = useState(false);
  const [students_ids, setSetudentId] = useState(location?.state?.student_ids);
  let [studentIdIndex, setStudentIdIndex] = useState(0);
  const [student_id, setSetudentsIds] = useState(
    location?.state?.student_ids[0]?.id
  );
  useEffect(() => {
    getQuestions();
  }, [student_id]);
  useEffect(() => {
    setSetudentsIds(students_ids[studentIdIndex]?.id);
  }, [studentIdIndex]);
  const getQuestions = async () => {
    let send = {
      exam_id: location?.state?.exam_id,
      student_id: student_id,
    };
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/Exams/new_select_student_exam_submission.php",
        send
      )
      .then((res) => {
        setQuestion(res?.message);
      })
      .catch((err) => {
        console.log(err);
        setQuestion([]);
      });
  };
  if (!location.state || !location?.state?.exam_id) {
    navigate(-1);
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Statistics" breadcrumbItem="Statistics" />

          <Row>
            <Col xs="12">
              <Card className="cardSolutions">
                {students_ids && students_ids?.length ? (
                  <div className="qList">
                    <div className="student_info">
                      <span style={{ fontWeight: "800" }}>
                        {students_ids[studentIdIndex]?.name}
                      </span>
                      {" - "}
                      <span style={{ fontWeight: "800" }}>
                        {students_ids[studentIdIndex]?.phone}
                      </span>
                    </div>
                    <div className="pagination">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "900",
                          fontSize: "19px",
                        }}
                        onClick={() => {
                          setStudentIdIndex(
                            studentIdIndex > 0
                              ? --studentIdIndex
                              : studentIdIndex
                          );
                        }}
                      >
                        &lt;
                      </span>
                      <span>{studentIdIndex + 1}</span>
                      <span
                        style={{
                          color: "black",
                          fontWeight: "900",
                          fontSize: "19px",
                        }}
                        onClick={() => {
                          setStudentIdIndex(
                            studentIdIndex < students_ids?.length - 1
                              ? ++studentIdIndex
                              : studentIdIndex
                          );
                        }}
                      >
                        &gt;
                      </span>
                    </div>
                  </div>
                ) : null}
                {!questions ? (
                  <Loader />
                ) : questions?.length ? (
                  questions?.map((item) => {
                    return (
                      <CardBody>
                        <div className="stats">
                          <div className="stats_top">
                            <div className="question_ans">
                              <p
                                className="question"
                                style={{ marginBottom: 0 }}
                              >
                                {item?.question_text}
                              </p>
                              <p style={{ fontWeight: 800, color: "red" }}>
                                {item?.choosed ? null : "Not Choosed"}
                              </p>
                            </div>
                          </div>
                          <div
                            className="stats_bottom st_sib"
                            style={{ flexDirection: "colmn" }}
                          >
                            {item?.arrAnswers?.map((p_item, index) => {
                              return (
                                <>
                                  <span
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      color:
                                        p_item?.answer_score == "true"
                                          ? "green"
                                          : "black",
                                    }}
                                  >
                                    <span>{index + 1}- </span>
                                    <span
                                      style={{
                                        color:
                                          p_item?.answer_value ==
                                            item?.choosed &&
                                          p_item?.answer_score == "true"
                                            ? "green"
                                            : p_item?.answer_value ==
                                                item?.choosed &&
                                              p_item?.answer_score == "false"
                                            ? "red"
                                            : "inherit",
                                      }}
                                    >
                                      {" "}
                                      {p_item?.answer_value}{" "}
                                      <span>
                                        {p_item?.answer_value ==
                                          item?.choosed &&
                                        p_item?.answer_score == "true"
                                          ? "( True )"
                                          : p_item?.answer_value ==
                                              item?.choosed &&
                                            p_item?.answer_score == "false"
                                          ? "( False )"
                                          : null}
                                      </span>
                                    </span>
                                  </span>
                                  <br />
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </CardBody>
                    );
                  })
                ) : null}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default StudentSubmisionList;
