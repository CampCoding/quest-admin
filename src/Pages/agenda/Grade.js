import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
// Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";

// Breadcrumb
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Loader } from "rsuite";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";

const AgendaGrade = () => {
  document.title = "Courses | Quest ";
  const navigate = useNavigate();

  // console.log(universitydata)
  const { univ_id } = useParams();
  const [grades, setgrades] = useState([]);
  const getgrades = async () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
      )
      .then((res) => {
        let universities = [];
        universities = [...res.message];
        let newdata = universities.filter(
          (item, index) => item.university_id == univ_id
        );
        setgrades(newdata[0]?.grades);
      });
  };

  useEffect(() => {
    getgrades();
  }, []);

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "grade name",
      accessor: "grade_name",
      Filter: false,
    },

    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-success"
              onClick={() => {
                navigate(
                  `/AgenaGradesPdfs/${cell.cell.row.original?.university_id}/${cell.cell.row.original?.grade_id}`,
                  {
                    state: {
                      universitydata: cell.cell.row.original,
                    },
                  }
                );
              }}
            >
              View
            </button>
          </>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Gradess" breadcrumbItem="Grade List" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="position-relative">
                    <div className="modal-button mt-2">
                      <Row className="align-items-start"></Row>
                    </div>
                  </div>
                  <div id="table-invoices-list grade_table">
                    {grades && grades.length ? (
                      <TableContainer
                        columns={columns}
                        data={grades}
                        isGlobalFilter={true}
                        customPageSize={10}
                        className="Invoice table"
                      />
                    ) : !grades.length ? (
                      <h2>No grades</h2>
                    ) : (
                      <Loader />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default AgendaGrade;
