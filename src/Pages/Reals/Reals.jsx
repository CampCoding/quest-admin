import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import "./style.css";
import "flatpickr/dist/themes/material_blue.css";

import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import RealseContainer from "./RealseContainer";
import { Drawer, Modal } from "antd";
const Reals = () => {
  const [univs, setUnivs] = useState([]);
  const [Reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUnivs, setSelectedUnivs] = useState(false);
  const [AddNewRealModal, setAddNewRealModal] = useState(false);
  const [AddNewRealData, setAddNewRealData] = useState({
    title: null,
    description: null,
    video_file: null,
  });

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

  const getReels = () => {
    axios
      .get(
        `https://camp-coding.tech/quest/platform/admin/reels/get_recently_reels.php`
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          setReels(res?.message);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getReels();
  }, []);
  console.log(Reels);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", AddNewRealData?.title);
    formData.append("description", AddNewRealData?.description);
    formData.append("video_file", AddNewRealData?.video_file);

    try {
      const res = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/reels/upload_reel.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", res);
      if (res.status == "success") {
        toast.success(res.message);
        getReels();
        setLoading(false);
        setAddNewRealModal(false);
        setAddNewRealData({
          title: null,
          description: null,
          video_file: null,
        });
      } else {
        toast.error(res.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Reels" breadcrumbItem="Reels List" />
          {/* <div className="univs">
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
          </div> */}

          <div className="action_btns">
            <button
              className="btn btn-success"
              onClick={() => setAddNewRealModal(true)}
            >
              Add
            </button>
          </div>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <RealseContainer data={Reels} getData={getReels} />
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
            <button className="btn btn-success w-100" onClick={handleSubmit}>
              {loading ? "Loading..." : "Add"}
            </button>
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
            value={AddNewRealData?.title}
            style={{ border: ".1px solid #49505794" }}
            onChange={(e) => {
              setAddNewRealData({
                ...AddNewRealData,
                title: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Reel describtion
          </label>
          <textarea
            className="form-control"
            value={AddNewRealData?.description}
            placeholder="Enter describtion"
            style={{ border: ".1px solid #49505794" }}
            onChange={(e) => {
              setAddNewRealData({
                ...AddNewRealData,
                description: e.target.value,
              });
            }}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Upload Reel
          </label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => {
              setAddNewRealData({
                ...AddNewRealData,
                video_file: e.target.files[0],
              });
            }}
            style={{ border: ".1px solid #49505794" }}
          />
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default Reals;
