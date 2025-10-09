/* eslint-disable no-sparse-arrays */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Input,
  FormFeedback,
  Label,
  Form,
  CloseButton,
} from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "rsuite";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { userData } from "../../store/getProfileData";

const TaskAnswerList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState(false);
  const [TaskRate, setTaskRate] = useState(false);
  const [showRateModal, setshowRateModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [score, setScore] = useState("");
  const [img, setimg] = useState(null);
  const [student_id, setStudent_id] = useState(false);
  const [task_comment, set_task_comment] = useState("");
  useEffect(() => {
    getAnswers();
  }, []);
  const getAnswers = async () => {
    const answer = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/tasks/select_solved_student_tasks.php",
      {
        task_id: location?.state?.task_id,
      }
    );
    setAnswers(answer?.message);
  };
  const handleAddRate = async () => {
    setAddLoading(true);
    const formdata = new FormData();
    formdata.append("image", img);
    const url = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
      formdata
    );
    // console.log(url?.headers ? "" : url);
    const data_send = {
      task_id: location?.state?.task_id,
      student_id: student_id,
      score,
      task_comment,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/tasks/add_score.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          setshowRateModal(false);
          getAnswers();
          setScore("");
          setimg(null);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went wrong");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setAddLoading(false);
      });
  };
  const [taskAnswers, setTaskAnswers] = useState(false);
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },

    {
      Header: "Student Name",
      accessor: "student_name",
    },
    {
      Header: "Answers",
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-primary"
              onClick={async () => {
                setTaskAnswers(cell.cell.row.original?.task_student_info);
              }}
            >
              View Answers
            </button>
          </>
        );
      },
    },
    {
      Header: "Correction Answer",
      Cell: (cell) => {
        return (
          <>
            {cell.cell.row.original?.task_correction_image?.length ? (
              <img src={cell.cell.row.original?.task_correction_image} alt="" />
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Rate Answer",
      Cell: (cell) => {
        return (
          <>
            {!cell.cell.row.original?.score?.length ? (
              <button
                className="btn btn-primary"
                onClick={async () => {
                  setshowRateModal(true);
                  setTaskRate(cell.cell.row.original?.task_student_info);
                  setStudent_id(cell.cell.row.original?.student_id);
                }}
              >
                Rate
              </button>
            ) : (
              cell.cell.row.original?.score
            )}
          </>
        );
      },
    },
  ];

  const correctTask = async (e) => {
    const formData = new FormData(e.currentTarget);
    const url = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
      formData
    );
  };
  const permissions = userData?.permissions;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Wqs Questions" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {!answers ? (
                    <Loader />
                  ) : Array.isArray(answers) && answers?.length ? (
                    <TableContainer
                      columns={columns}
                      data={answers}
                      isGlobalFilter={true}
                      customPageSize={10}
                      className="Invoice table"
                    />
                  ) : (
                    <h4>No Answers</h4>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal isOpen={taskAnswers}>
          <ModalHeader tag="h4">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <h4> Task Answers </h4>
              <CloseButton
                onClick={() => {
                  setTaskAnswers(false);
                }}
                style={{ marginLeft: "auto" }}
              />
            </div>
          </ModalHeader>
          <ModalBody>
            {taskAnswers?.length && taskAnswers ? (
              taskAnswers?.map((item) => {
                return (
                  <div
                    className="aswersContainer"
                    style={{
                      width: "200px",
                      paddingBottom: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="answerImage">
                      <img
                        src={item?.answer_data}
                        alt=""
                        style={{ width: "100%", marginBottom: "20px" }}
                      />
                    </div>
                    <button
                      className={
                        !parseInt(item?.hightlight)
                          ? "btn btn-success"
                          : "btn btn-primary"
                      }
                      onClick={async () => {
                        await axios
                          .post(
                            "https://camp-coding.tech/quest/platform/admin/tasks/make_hightlight.php",
                            {
                              answer_id: item?.answer_id,
                              hightlight: parseInt(item?.hightlight) ? 0 : 1,
                            }
                          )
                          .then((res) => {
                            if (res?.status == "success") {
                              toast.success(res?.message);
                              getAnswers();
                            } else {
                              toast.error(res?.message);
                            }
                          });
                        setTaskAnswers(false);
                      }}
                    >
                      {!parseInt(item?.hightlight) ? "Highlight" : "Obscure"}
                    </button>
                  </div>
                );
              })
            ) : (
              <h4>No Answers</h4>
            )}
          </ModalBody>
        </Modal>

        <Modal isOpen={showRateModal}>
          <ModalHeader tag="h4">
            {permissions?.includes("*2_4") ||
            permissions?.startsWith("2_4") ||
            permissions == "all" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <h4> Add Rate </h4>
                <CloseButton
                  onClick={() => {
                    setshowRateModal(false);
                  }}
                  style={{ marginLeft: "auto" }}
                />
              </div>
            ) : null}
          </ModalHeader>
          <ModalBody>
            <div
              className="aswersContainer"
              style={{
                width: "100%",
                paddingBottom: "10px",
                marginBottom: "20px",
              }}
            >
              <label htmlFor="">Comment</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                style={{ display: "flex" }}
                onChange={(e) => set_task_comment(e.target.value)}
              ></textarea>
              <div style={{ textAlign: "center" }}></div>
              <label>Score:</label>
              <input
                style={{
                  width: "100%",
                  padding: "10px",
                  borderReduis: "4px",
                  outline: "none",
                  border: "1px soild #ccc",
                }}
                value={score}
                type="text"
                onChange={(e) => {
                  setScore(e.target.value);
                }}
              />
              <div style={{ textAlign: "center", margin: "10px auto" }}>
                <button
                  onClick={handleAddRate}
                  disabled={addLoading}
                  style={{ cursor: addLoading ? "no-drop" : "pointer" }}
                  className="btn btn-primary"
                >
                  add
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default TaskAnswerList;
