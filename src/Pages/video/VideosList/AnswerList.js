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

const AnswerList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState(false);

  useEffect(() => {
    getAnswers();
  }, []);
  const getAnswers = async () => {
    const answer = await axios.post("", {
      video_id: location?.state?.video_id
    });
    setAnswers(answer?.message);
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
      accessor: "answer_name"
    },
    {
      Header: "Student Image",
      Cell: (cell) => <img src={cell.cell.row.original?.answer_image} alt="" />
    },
    // {
    //   Header: 'Action',
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         <button className="btn btn-primary">Highlight</button>
    //       </>
    //     );
    //   }
    // }
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Wqs Questions" breadcrumbItem="Customers" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {!answers ? (
                    <Loader />
                  ) : answers?.length ? (
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
      </div>
    </React.Fragment>
  );
};

export default AnswerList;
