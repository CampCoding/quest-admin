import React, { useState } from "react";
import { Chart } from "react-google-charts";
import {
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TableContainer from "../../components/Common/TableContainer";
import { Loader } from "rsuite";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { ContentCopyOutlined, UnarchiveSharp } from "@mui/icons-material";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
import {
  numberedObject,
  permissions,
  transformedPermissions,
  userData,
} from "../../store/getProfileData";
import TagPicker from "./tagPicker";
import { MenuItem, Select } from "@mui/material";

const Polling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  document.title = "Users | Quest ";
  const [modal, setmodal] = useState(false);

  const [selectedPoll, set_selected_poll] = useState(null);
  const [matary_users, setMataryUsers] = useState(false);
  let [answerNumber, setAnswrsNumber] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [grades, setGrades] = useState(false);
  const [questionText, set_questionText] = useState("");
  const [pollData, setPollData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedUniv, setSelectedUnivs] = useState(userData?.university_id);
  const [universities, setUniversities] = useState(false);
  const [showAssign, setAssignModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  // polls
  const columns = [
    {
      Header: "poll_id",
      accessor: "polling_id",
    },
    {
      Header: "question",
      accessor: "question",
    },
    {
      Header: "Answers",
      Cell: (cell) => {
        return (
          <span>
            <button
              className="btn btn-success"
              onClick={() => {
                setPollData(cell.cell.row?.original);
              }}
            >
              View
            </button>
          </span>
        );
      },
    },
    {
      Header: "Finish",
      Cell: (cell) => {
        return (
          <span>
            {cell.cell.row?.original?.finished == 0 ? (
              <button
                className="btn btn-success"
                onClick={() => {
                  setUserId(cell.cell.row?.original);
                }}
              >
                Finish
              </button>
            ) : (
              "Finished"
            )}
          </span>
        );
      },
    },
  ];

  const getGrades = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
      )
      .then((res) => {
        if (Array.isArray(res.message)) {
          let AllGrades = [...res.message];
          let newGrade = AllGrades.filter(
            (item) => item.university_id == selectedUniv
          );
          let grades = [newGrade[0]?.grades];
          setGrades(grades[0]);

          setSelectedGrade(grades[0].grade_id);
        }
      });
  };
  const getUniversities = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
      )
      .then((res) => {
        if (Array.isArray(res.message)) setUniversities(res.message);
        setSelectedUnivs(res?.message[0]?.university_id);
      })
      .catch((err) => console.log(err));
  };
  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);
  const handleaddnewuni = () => {
    const data_send = {
      question: questionText,
      answers: answers?.map((item) => item?.answer).join("**camp**"),
      grade_id: location?.state?.grade_id,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/polling/insert_polling.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setAnswers([]);
          setAnswrsNumber(1);
          set_questionText(null);
          setmodal(false);
          selectPolls();
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const selectPolls = () => {
    const data_send = {
      grade_id: location?.state?.grade_id,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/polling/select_polling_data.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setMataryUsers(res.message);

          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
          setMataryUsers([]);
        } else {
          toast.error("Something Went Error");
          setMataryUsers([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setMataryUsers([]);
      });
  };
  const finishPoll = () => {
    const data_send = {
      polling_id: userId?.polling_id,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/polling/finished_polling.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          selectPolls();
          setUserId(false);
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {}, [answers]);
  useEffect(() => {
    selectPolls();
  }, []);
  // useEffect(() => {
  //   if (selectedUniv != 0) getGrades();
  // }, [selectedUniv]);
  // useEffect(() => {
  //   if (showAssign) getUniversities();
  // }, [showAssign]);
  // useEffect(() => {
  //   if (universities && showAssign && selectedUniv != 0)
  //     setUniversities(
  //       universities?.filter(
  //         (item) => item.university_id == userData?.university_id
  //       )
  //     );
  // }, [universities, showAssign, selectedUniv]);
  // useEffect(() => {
  //   if (selectedPoll) AssignPoll();
  // }, [selectedPoll]);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="header-btns">
            <button
              className="btn btn-success"
              onClick={() => {
                setmodal(true);
              }}
            >
              Add Poll Question
            </button>
            {/* <button
              className="btn btn-success"
              onClick={() => {
                setAssignModal(true);
              }}
            >
              Assign Poll
            </button> */}
          </div>
          <div id="table-invoices-list">
            {!matary_users ? (
              <Loader />
            ) : matary_users?.length ? (
              <TableContainer
                columns={columns}
                data={matary_users}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Polls</h4>
            )}
          </div>
        </Container>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle} tag="h4">
            Add New Poll
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleaddnewuni();
                return false;
              }}
            >
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label className="form-label">Text</Label>
                    <Input
                      name="book_title"
                      type="text"
                      value={questionText}
                      onChange={(e) => set_questionText(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="answerControl">
                      <Label className="form-label">Answers</Label>
                      <span
                        className="btn btn-success"
                        onClick={() => {
                          setAnswrsNumber(++answerNumber);
                        }}
                      >
                        Add New Answer
                      </span>
                    </div>
                    {Array(answerNumber)
                      ?.fill(0)
                      ?.map((item, index) => {
                        return (
                          <div className="answerContainer">
                            <Input
                              name="book_title"
                              type="text"
                              onChange={(e) =>
                                answers?.filter((item) => item?.id == index)
                                  ?.length
                                  ? setAnswers(
                                      answers?.map((item) => {
                                        if (item?.id == index) {
                                          item.answer = e?.target?.value;
                                        }
                                        return item;
                                      })
                                    )
                                  : setAnswers([
                                      ...answers,
                                      { id: index, answer: e.target?.value },
                                    ])
                              }
                            />
                            <span
                              className="btn btn-danger"
                              onClick={() => {
                                setAnswrsNumber(--answerNumber);
                                setAnswers(
                                  answers?.filter((item) => item.id != index)
                                );
                              }}
                            >
                              delete
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <button type="submit" className="btn btn-success save-user">
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={userId} toggle={() => setUserId(false)}>
          <ModalHeader toggle={() => setUserId(false)} tag="h4">
            Finish Poll
          </ModalHeader>
          <ModalBody>
            <h3>Are You Sure ..?</h3>
            <div
              className="btns"
              style={{ display: "flex", gap: "5px", alignItems: "center" }}
            >
              <button
                className="btn btn-danger"
                style={{ width: "fit-content" }}
                onClick={() => finishPoll()}
              >
                Finish
              </button>
              <button
                className="btn btn-success"
                style={{ width: "fit-content" }}
                onClick={() => setUserId(false)}
              >
                Close
              </button>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={pollData} toggle={() => setPollData(false)}>
          <ModalHeader toggle={() => setPollData(false)} tag="h4">
            Answers
          </ModalHeader>
          <ModalBody>
            {console.log(
              pollData?.ans?.length
                ? [
                    ["name", "count"],
                    ...pollData?.ans.map(
                      (item) =>
                        Object.keys(item).map((ansItem) => [
                          item?.name,
                          parseInt(item?.count),
                        ])[0]
                    ),
                  ]
                : []
            )}
            <Chart
              chartType="PieChart"
              data={
                pollData?.ans?.length
                  ? [
                      ["name", "count"],
                      ...pollData?.ans.map(
                        (item) =>
                          Object.keys(item).map((ansItem) => [
                            item?.name,
                            parseInt(item?.count),
                          ])[0]
                      ),
                    ]
                  : []
              }
              // options={options}
              width={"400px"}
              height={"400px"}
            />

            <div
              className="btns"
              style={{ display: "flex", gap: "5px", alignItems: "center" }}
            >
              <button
                className="btn btn-success"
                style={{ width: "fit-content" }}
                onClick={() => setPollData(false)}
              >
                Close
              </button>
            </div>
          </ModalBody>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default Polling;
