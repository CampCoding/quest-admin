import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import TableContainer from "../../components/Common/TableContainer";
// import CourseListTable from "../CourseTable/courseListTable";

const Charge = () => {
  const navigate = useNavigate();
  document.title = "Charge | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [Charge, setCharge] = useState(false);
  const [charges, setCharges] = useState(false);
  const [chargeData, setChargeData] = useState({});
  const [Charge_title, set_Charge_title] = useState("");

  useEffect(() => {
    getCharges();
  }, []);

  const getCharges = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/competation/select_charged_students.php"
      );
      if (Array.isArray(get?.message)) setCharges(get.message);
      else setCharges([]);
    } catch (err) {
      setCharges([]);
    }
  };

  const addCharge = async (e) => {
    const data_send = {
      ...chargeData,
    };

    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/competation/charge_student_score.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setCharge(false);
      set_Charge_title("");
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
  };

  const inquire = async (e) => {
    const data_send = {
      ...chargeData,
    };

    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/competation/get_student_score.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setStudentData(add.message);
    } else {
      toast.error(add.message);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);
  const columns = [
    {
      Header: "Student ID",
      accessor: "student_id",
    },
    {
      Header: "Student Name",
      accessor: "student_name",
    },
    {
      Header: "Student Phone",
      accessor: "phone",
    },
    {
      Header: "Student Email",
      accessor: "student_email",
    },
    {
      Header: "Charged Score",
      accessor: "total_score",
    },
  ];
  const [studentData, setStudentData] = useState({});
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
              Charge
            </button>
          </div>
          <div id="table-invoices-list">
            {!charges ? (
              <Loader />
            ) : charges?.length ? (
              <TableContainer
                columns={columns}
                data={charges}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Charges</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Charge
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addCharge(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Student ID</Label>
                  <Input
                    name="Charge_title"
                    type="text"
                    onChange={(e) =>
                      setChargeData({
                        ...chargeData,
                        student_id: e.target.value,
                      })
                    }
                  />
                  <span
                    className="btn btn-primary my-3"
                    onClick={() => {
                      inquire();
                    }}
                  >
                    Inquire
                  </span>
                </div>

                {studentData?.phone ? (
                  <div className="student_data">
                    <p>Phone: {studentData?.phone}</p>
                    <p>Name: {studentData?.student_name}</p>
                    <p>Score: {studentData?.score}</p>
                  </div>
                ) : null}
                <div className="mb-3">
                  <Label className="form-label">Packages</Label>
                  <select
                    onChange={(e) =>
                      setChargeData({
                        ...chargeData,
                        score: e.target.value,
                      })
                    }
                    id=""
                  >
                    <option value=""></option>
                    <option value="10">10 Points</option>
                    <option value="100">100 Points</option>
                  </select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-success save-user">
                    Add Points
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Charge;
