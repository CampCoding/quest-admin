import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Loader } from "rsuite";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";

const AgenaUniversities = () => {
  document.title = "Agenda Universities | Quest";
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [showAddUni, setShowAddUni] = useState(false);
  const [itemLoader, setItemLoader] = useState(false);

  const getUniversities = async () => {
    setItemLoader(true);
    try {
      const response = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/universities/select_university.php"
      );
      if (response && response.message) {
        setUniversities(response.message);
      }
    } catch (error) {
      console.error("Error fetching universities", error);
    } finally {
      setItemLoader(false);
    }
  };

  useEffect(() => {
    getUniversities();
  }, []);

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "University Name",
      accessor: "university_name",
    },
    {
      Header: "View University",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              navigate(
                `/AgenaGrades/${cell.cell.row.original?.university_id}`,
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
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Universities" breadcrumbItem="University List" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="position-relative">
                    <div className="modal-button mt-2">
                      <Row className="align-items-start">
                        <Col className="col-sm"></Col>
                      </Row>
                    </div>
                  </div>
                  <div id="table-invoices-list">
                    {itemLoader ? (
                      <Loader />
                    ) : (
                      <TableContainer
                        columns={columns}
                        data={Array.isArray(universities) ? universities : []}
                        isGlobalFilter={true}
                        customPageSize={10}
                        className="Invoice table"
                      />
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

export default AgenaUniversities;
