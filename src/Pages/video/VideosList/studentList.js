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
  CloseButton
} from "reactstrap";
import TableContainer from "../../../components/Common/TableContainer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "rsuite";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const UnitStudentList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getStudents();
  }, []);
  const getStudents = async () => {
    setLoading(true);
    const student = await axios.post("", {
      video_id: location?.state?.video_id
    });
    setStudents(student?.message);
    setLoading(false);
  };

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      }
    },

    {
      Header: "Student Name",
      accessor: "student_name"
    },
    {
      Header: "Student Image",
      Cell: (cell) => <img src={cell.cell.row.original?.student_image} alt="" />
    },
    {
      Header: 'Action',
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/videos/answeredStudents/studentVideoAnswers", {
                  state: {
                    student_id: cell.cell.row.original?.student_id,
                    unit_id: location?.state?.unitdata?.unit_id
                  }
                })
              }
            >
              Show Answers
            </button>
          </>
        );
      }
    }
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Video Questions Answers" breadcrumbItem="Customers" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {!students ? (
                    <Loader />
                  ) : students?.length ? (
                    <TableContainer
                      columns={columns}
                      data={students}
                      isGlobalFilter={true}
                      customPageSize={10}
                      className="Invoice table"
                    />
                  ) : (
                    <h4>No Students</h4>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UnitStudentList;
