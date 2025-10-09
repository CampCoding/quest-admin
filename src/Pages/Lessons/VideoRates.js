import React, { useState } from "react";
import {
  Col,
  Container,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown,
} from "reactstrap";

import { Icon } from "@iconify/react";
import { ContentCopyOutlined } from "@mui/icons-material";
import axios from "axios";
import { useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import TableContainer from "../../components/Common/TableContainer";
// import CourseListTable from "../CourseTable/courseListTable";

const VideoRates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  document.title = "Video | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [video, setVideo] = useState(false);
  const [rates, setRates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videos, setvideos] = useState(false);
  const [video_title, set_video_title] = useState("");
  const [edit, setEdit] = useState(null);

  const StudentsColumns = [
    {
      Header: "student_id",
      accessor: "student_id",
    },
    {
      Header: "student_name",
      accessor: "student_name",
    },
    {
      Header: "student_email",
      Cell: (cell) => {
        return (
          <>
            <CopyToClipboard
              style={{
                padding: "0 14px",
                cursor: "pointer",
                width: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
              text={cell.cell.row.original?.student_email}
              onCopy={() => toast.success("Copied")}
            >
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <b
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "green",
                  }}
                >
                  {cell.cell.row.original?.student_email}
                </b>
                <em>
                  <ContentCopyOutlined />
                </em>
              </span>
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      Header: "phone",
      accessor: "phone",
    },
    {
      Header: "question_text",
      accessor: "question_text",
    },
    {
      Header: "Rating",
      Cell: (cell) => {
        return (
          <div class="ratings">
            {Array(parseInt(cell?.cell?.row?.original?.rating))
              .fill(0)
              .map((item) => {
                return (
                  <img
                    src="https://raw.githubusercontent.com/mustafadalga/ratings-card/461b28d30e6d5b4475e0f78d2f65700674808565/assets/img/star2.svg"
                    alt=""
                  />
                );
              })}
            {Array(5 - parseInt(cell?.cell?.row?.original?.rating))
              .fill(0)
              .map((item) => {
                return (
                  <img
                    src="https://res.cloudinary.com/duovxefh6/image/upload/v1710597956/purepng.com-grey-starstargeometricallydecagonconcavestardomclipartblackgrey-1421526502793oblca_ca8lyn.png"
                    alt=""
                  />
                );
              })}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getvideos();
    getRates();
  }, []);

  console.log(location);

  const getvideos = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/courses/rating_data.php",
        {
          video_id: location?.state?.video?.unit_video_id,
        }
      );
      if (Array.isArray(get?.message)) setvideos(get.message);
      else setvideos([]);
    } catch (err) {
      setvideos([]);
    }
  };

  const getRates = async () => {
    setLoading(true);
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/courses/students_rates.php",
        {
          video_id: location?.state?.video?.unit_video_id,
        }
      );
      if (Array.isArray(get?.message)) setRates(get.message);
      else setRates([]);
      setLoading(false);
    } catch (err) {
      // setvideos([]);
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="QuestionsDiv">
          {videos && videos?.length
            ? videos?.map((item) => {
                return (
                  <div class="card">
                    <h3 class="card-title">{item?.qTxt}</h3>
                    <div class="card-rating">
                      <div class="ratings">
                        {Array(parseInt(item?.average_rate))
                          .fill(0)
                          .map((item) => {
                            return (
                              <img
                                src="https://raw.githubusercontent.com/mustafadalga/ratings-card/461b28d30e6d5b4475e0f78d2f65700674808565/assets/img/star2.svg"
                                alt=""
                              />
                            );
                          })}
                        {Array(5 - parseInt(item?.average_rate))
                          .fill(0)
                          .map((item) => {
                            return (
                              <img
                                src="https://res.cloudinary.com/duovxefh6/image/upload/v1710597956/purepng.com-grey-starstargeometricallydecagonconcavestardomclipartblackgrey-1421526502793oblca_ca8lyn.png"
                                alt=""
                              />
                            );
                          })}
                      </div>
                      <div class="card-rating-text">
                        {item?.average_rate ? parseInt(item?.average_rate) : 0}{" "}
                        out of 5
                      </div>
                    </div>
                    <p class="rating-count">
                      {parseInt(item?.average_rate)} student ratings
                    </p>
                    {/* <div class="rating-percents">
                      <div class="rating-percent">
                        <span class="rating-no">5 star</span>
                        <div class="rating-progress"></div>
                        <span class="rating-percent-no">84%</span>
                      </div>
                      <div class="rating-percent">
                        <span class="rating-no">4 star</span>
                        <div class="rating-progress"></div>
                        <span class="rating-percent-no">9%</span>
                      </div>
                      <div class="rating-percent">
                        <span class="rating-no">3 star</span>
                        <div class="rating-progress"></div>
                        <span class="rating-percent-no">4%</span>
                      </div>
                      <div class="rating-percent">
                        <span class="rating-no">2 star</span>
                        <div class="rating-progress"></div>
                        <span class="rating-percent-no">2%</span>
                      </div>
                      <div class="rating-percent">
                        <span class="rating-no">1 star</span>
                        <div class="rating-progress"></div>
                        <span class="rating-percent-no">1%</span>
                      </div>
                    </div> */}
                  </div>
                );
              })
            : null}
        </div>
        <Container fluid={true}>
          <h1>Rates</h1>
          <div id="table-invoices-list">
            {loading ? (
              <Loader />
            ) : rates?.length ? (
              <TableContainer
                columns={StudentsColumns}
                data={rates}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Rates</h4>
            )}
          </div>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default VideoRates;
