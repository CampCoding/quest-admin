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
import AddAgendaPdf from "./AgenaGradesPdfsManagement/add";
import ShowHideAgendaPdf from "./AgenaGradesPdfsManagement/show_hide";

const AgenaGradesPdfs = () => {
  document.title = "Agendas | Quest ";
  const navigate = useNavigate();
  const [add, setAdd] = useState(false);
  const [showHide, setShowHide] = useState(false);

  // console.log(universitydata)
  const { grade_id } = useParams();
  const [grades, setgrades] = useState([]);
  const getgrades = async () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/courses/select_pdf_agenda.php",
        {
          grade_id,
        }
      )
      .then((res) => {
        setgrades(res?.message);
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
      Header: "PDF",
      Cell: (cell) => {
        return (
          <div className="d-flex gap-1 align-items-center">
            <button
              className={
                cell.cell.row.original?.hidden == "no"
                  ? "btn btn-danger"
                  : "btn btn-success"
              }
              onClick={() =>
                window.open(cell.cell.row.original?.pdf_url, "_blanck")
              }
            >
              open
            </button>{" "}
          </div>
        );
      },
    },

    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <div className="d-flex gap-1 align-items-center">
            <button
              className={"btn btn-danger"}
              onClick={() => setShowHide(cell.cell.row.original)}
            >
              Delete
            </button>{" "}
          </div>
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
                  <div className="position-relative">
                    <div className="modal-button mt-2">
                      <Row className="align-items-start">
                        <Col className="col-sm">
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              setAdd(true);
                            }}
                          >
                            Add Agenda
                          </button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div id="table-invoices-list grade_table">
                    {grades && grades?.length ? (
                      <TableContainer
                        columns={columns}
                        data={grades}
                        isGlobalFilter={true}
                        customPageSize={10}
                        className="Invoice table"
                      />
                    ) : !grades?.length ? (
                      <h2>No PDFS</h2>
                    ) : (
                      <Loader />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <AddAgendaPdf modal={add} setModal={setAdd} getData={getgrades} />
        <ShowHideAgendaPdf
          modal={showHide}
          setModal={setShowHide}
          getData={getgrades}
        />
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default AgenaGradesPdfs;
