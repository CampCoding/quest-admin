import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import "./style.css";
import "flatpickr/dist/themes/material_blue.css";

import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";

import { Drawer, Modal } from "antd";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import RealseContainer from "../Reals/RealseContainer";
import CommunityContainer from "./CommunityContainer";
const Community = () => {
  const [univs, setUnivs] = useState([]);
  const [selectedUnivs, setSelectedUnivs] = useState(false);
  const [AddNewRealModal, setAddNewRealModal] = useState(false);

  const getUnivs = async () => {
    const selct_univs = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
    );
    setUnivs(selct_univs.message);
  };

  useEffect(() => {
    getUnivs();
  }, []);

  const [filterGrades, setFilterGrades] = useState(false);
  const [selectGrades, setSelectGrades] = useState(false);
  const getFilterGrades = () => {
    setFilterGrades(
      univs?.filter((item) => item.university_id == selectedUnivs)[0]?.grades
    );
  };

  useEffect(() => {
    if (selectedUnivs) {
      getFilterGrades();
    } else {
      setFilterGrades(false);
    }
  }, [selectedUnivs]);

  console.log(filterGrades);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Community" breadcrumbItem="Community List" />
          <div className="univs">
            {univs && univs.length
              ? univs.map((item, index) => {
                  return (
                    <span
                      className={
                        selectedUnivs &&
                        selectedUnivs.length &&
                        selectedUnivs == item?.university_id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        selectedUnivs == item?.university_id
                          ? setSelectedUnivs(false)
                          : setSelectedUnivs(item?.university_id)
                      }
                    >
                      {item?.university_name}
                    </span>
                  );
                })
              : null}
          </div>

          <div className="univs">
            {filterGrades && filterGrades.length
              ? filterGrades.map((item, index) => {
                  return (
                    <span
                      className={
                        selectGrades &&
                        selectGrades.length &&
                        selectGrades == item?.grade_id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        selectGrades == item?.grade_id
                          ? setSelectGrades(false)
                          : setSelectGrades(item?.grade_id)
                      }
                    >
                      {item?.grade_name}
                    </span>
                  );
                })
              : null}
          </div>

          <div className="action_btns">
            {/* <button
              className="btn btn-success"
              onClick={() => setAddNewRealModal(true)}
            >
              Add
            </button> */}
          </div>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CommunityContainer />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>

      <Drawer
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setAddNewRealModal(false)}
        open={AddNewRealModal}
        footer={
          <>
            <button className="btn btn-success w-100">Add</button>
          </>
        }
      >
        <p style={{ fontSize: "22px" }}>Add new reel</p>
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Reel title
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter title"
            style={{ border: ".1px solid #49505794" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Reel describtion
          </label>
          <textarea
            className="form-control"
            placeholder="Enter describtion"
            style={{ border: ".1px solid #49505794" }}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Upload Reel
          </label>
          <input
            type="file"
            className="form-control"
            // placeholder="Enter title"
            style={{ border: ".1px solid #49505794" }}
          />
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default Community;
