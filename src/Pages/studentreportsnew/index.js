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
} from "reactstrap";
import {
  Form,
  Button,
  ButtonToolbar,
  RadioGroup,
  Radio,
  SelectPicker,
  InputPicker,
  Loader,
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
import { userData } from "../../store/getProfileData";
const StudentNew = () => {
  const location = useLocation();
  document.title = "Students | Quest ";
  const navigate = useNavigate();
  const tabs = [
    { id: 1, title: "Top Students" },
    { id: 2, title: "Not To Marry Student" },
  ];
  const [tab, setTab] = useState(tabs[0]?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [student, setStudent] = useState(false);
  const [university, setUniversity] = useState(false);
  const [grades, setGrades] = useState(false);
  const [originalData, setOriginalData] = useState(false);
  // originalData
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
      tab == 1
        ? "https://camp-coding.tech/quest/platform/admin/email/select_grade_top.php"
        : "https://camp-coding.tech/quest/platform/admin/email/select_grade_ntm.php",
      {
        university_id: location?.state?.university_id
          ? location?.state?.university_id
          : userData?.university_id, //all - 1
        grade_id: location?.state?.grade_id, //all - 1
        have_sub: "yes",
      }
    );
    // console.log(student?.message);
    setOriginalData(student?.message?.reverse());
  };

  useEffect(() => {
    getStudents();
  }, [tab]);
  useEffect(() => {
    if (originalData && originalData?.length) {
      setStudent(originalData);
      // setStudent(
      //   tab == "first"
      //     ? originalData
      //         ?.filter((item, index) => index < 5)
      //         .map((item, index) => {
      //           item.order_no = index + 1;
      //           return item;
      //         })
      //         .reverse()
      //     : originalData?.filter(
      //         (item, index) => index > originalData?.length - 6
      //       )
      // );
    }
  }, [tab, originalData]);
  if (!location?.state?.grade_id) {
    navigate(-1);
  }
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
                    {tabs && tabs?.length
                      ? tabs?.map((item) => {
                          return (
                            <button
                              className={
                                tab == item?.id ? "btn btn-success" : " btn"
                              }
                              onClick={() => {
                                setTab(item?.id);
                              }}
                            >
                              {item?.title}
                            </button>
                          );
                        })
                      : null}
                  </div>
                  <div id="table-invoices-list">
                    {!student ? (
                      <Loader />
                    ) : student.length ? (
                      <StudntListTable
                        tab={tab}
                        Units={student}
                        getStudents={() => getStudents()}
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
    </React.Fragment>
  );
};

export default StudentNew;
