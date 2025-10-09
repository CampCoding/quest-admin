import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Modal,
  TabContent,
  TabPane,
  Tooltip,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Input,
  CloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  Form,
  Button,
  ButtonToolbar,
  RadioGroup,
  Radio,
  SelectPicker,
  InputPicker,
} from "rsuite";

// Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

// Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import StudntListTable from "./StudentTable/StudntTable";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import "./style.css";
const Student = () => {
  const location = useLocation();
  document.title = "Students | Quest ";
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [student, setStudent] = useState(false);
  const [university, setUniversity] = useState(false);
  const [grades, setGrades] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [userId, setUserId] = useState(null);
  const getUnversity = async () => {
    const univ = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
    );
    setUniversity(univ?.message);
  };

  useEffect(() => {
    getUnversity();
  }, []);
  const [univ_id, setUnivId] = useState();
  const [data_send, setDataSend] = useState({
    university_id: "all", //all - 1
    grade_id: "all", //all - 1
    have_sub: "all", //all - yes - no
  });
  useEffect(() => {
    if (university && university.length) {
      setGrades(
        university.filter((item) => item.university_id == univ_id)[0]?.grades
      );
      setDataSend({
        ...data_send,
        university_id: univ_id ? univ_id : "all",
      });
    }
  }, [univ_id]);

  const getStudents = async (e) => {
    data_send.grade_id =
      data_send.university_id != "all"
        ? data_send.grade_id
          ? data_send.grade_id
          : "all"
        : "all";
    const student = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/students/select_students.php",
      {
        university_id: "all", //all - 1
        grade_id: "all", //all - 1
        have_sub: "yes",
      }
    );
    setStudent(student?.message);
  };

  useEffect(() => {
    getStudents();
  }, []);
  // if (!location?.state?.grade_id) {
  //   navigate(-1);
  // }

  const handelDelete = async () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/delete_ebook.php",
        { student_id: userId?.student_id }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          setDeleteId(false);
          setUserId(null);
          getStudents();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => toast.error(err));
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Students" breadcrumbItem="Students List" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="filter_stu">
                    {/* <div>
                      <Form
                        className="stu_her"
                        onChange={(formValue) => formValue}
                      >
                        {university && university.length ? (
                          <Form.Group controlId="inputPicker">
                            <Form.ControlLabel>Unversity:</Form.ControlLabel>
                            <Form.Control
                              name="university_id"
                              accepter={InputPicker}
                              data={university.map((item) => {
                                return {
                                  label: item.university_name,
                                  value: item.university_id,
                                };
                              })}
                              onChange={(e) => setUnivId(e)}
                            />
                          </Form.Group>
                        ) : null}
                        {grades && grades.length ? (
                          <Form.Group controlId="inputPicker">
                            <Form.ControlLabel>Grades:</Form.ControlLabel>
                            <Form.Control
                              name="grade_id"
                              accepter={InputPicker}
                              data={grades.map((item) => {
                                return {
                                  label: item.grade_name,
                                  value: item.grade_id,
                                };
                              })}
                              onChange={(e) => {
                                setDataSend({
                                  ...data_send,
                                  grade_id: e ? e : "all",
                                });
                              }}
                            />
                          </Form.Group>
                        ) : null}
                        <Form.Group controlId="radio">
                          <Form.ControlLabel>have_sub :</Form.ControlLabel>
                          <Form.Control
                            name="have_sub"
                            onChange={(e) => {
                              setDataSend({
                                ...data_send,
                                have_sub: e ? e : "all",
                              });
                            }}
                            accepter={RadioGroup}
                          >
                            <Radio value="all">All</Radio>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                          </Form.Control>
                        </Form.Group>
                      </Form>
                      <button
                        className="btn btn-success"
                        onClick={() => getStudents()}
                      >
                        Show Students
                      </button>
                    </div> */}
                  </div>
                  <div id="table-invoices-list">
                    {student && student.length ? (
                      <StudntListTable
                        Units={student}
                        getStudents={() => getStudents()}
                        setDeleteId={setDeleteId}
                        setUserId={setUserId}
                      />
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal title="add unit" isOpen={isModalOpen}>
          <form
            action="#"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              setIsModalOpen(false);
            }}
          >
            <CloseButton
              onClick={() => setIsModalOpen(false)}
              style={{ marginLeft: "auto" }}
            />

            <div className="input_Field">
              <label forHtml="unit_name">Unit Name</label>
              <Input
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                }}
                type="text"
                name="unit_name"
                id="unit_name"
                placeholder="unit_name"
                required
              />
            </div>
            <button
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Add Unit{" "}
            </button>
          </form>
        </Modal>
        <ToastContainer />
      </div>

      <Modal isOpen={!!deleteId} toggle={() => setDeleteId(false)} centered>
        <ModalHeader toggle={() => setDeleteId(false)}>
          Delete ebook
        </ModalHeader>
        <ModalBody>
          <h5>Are You Sure To Delete ebook - {userId?.name} ?</h5>
        </ModalBody>
        <ModalFooter>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="btn btn-danger "
              style={{ margin: "0 !important" }}
              onClick={handelDelete}
            >
              Yes
            </button>
            <button
              className="btn btn-primary"
              style={{ margin: "0" }}
              onClick={() => setDeleteId(false)}
            >
              No
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Student;
