import { Breadcrumbs } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Loader } from "rsuite";
import { Chart } from "react-google-charts";

const ExamQuestionStatistics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestion] = useState(false);
  const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  const options = {
    animation: {
      startup: true,
      easing: "linear",
      duration: 1500,
    },
  };
  useEffect(() => {
    getQuestions();
  }, []);
  const getQuestions = async () => {
    try {
      const questions = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/Exams/select_statistics.php",
        {
          exam_id: location.state.exam_id,
        }
      );

      setQuestion(questions.message);
    } catch (e) {
      setQuestion([]);
    }
  };
  if (!location.state || !location.state.exam_id) {
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
                {!questions ? (
                  <Loader />
                ) : questions?.length ? (
                  questions?.map((item) => {
                    let chartsOData = item?.arrChartJS.map((chart) => [
                      chart[0],
                      0,
                    ]);
                    return (
                      <CardBody>
                        <div className="stats">
                          <div className="stats_top">
                            <div className="question_ans">
                              <p
                                className="question"
                                style={{
                                  marginBottom: 0,
                                  fontweight: 900,
                                  fontSize: "19px",
                                }}
                              >
                                {item?.question_text}
                              </p>
                              <p className="res_nums" style={{ marginTop: 0 }}>
                                {item?.choosed_count?.reduce(
                                  (acc, curr) => acc + parseInt(curr),
                                  0
                                )}{" "}
                                Responses
                              </p>
                            </div>
                          </div>
                          <div className="stats_bottom">
                            <div className="labelsColors">
                              <Chart
                                chartType="PieChart"
                                data={item?.arrChartJS}
                                options={options}
                                width={"1000px"}
                                height={"400px"}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="trueScore">
                          <span style={{ fontWeight: 800 }}>True Answer: </span>
                          <span style={{ color: "green", fontWeight: 800 }}>
                            {item?.true_answer?.answerText}
                          </span>{" "}
                          <br />
                          <span style={{ fontWeight: 800 }}>
                            Choosed Count:{" "}
                            <span style={{ color: "green", fontWeight: 800 }}>
                              {item?.true_answer?.count}
                            </span>
                          </span>
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

export default ExamQuestionStatistics;
