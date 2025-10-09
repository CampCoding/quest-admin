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

const StudentVideosStats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  document.title = "Video Store | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [video, setVideo] = useState(false);
  const [video_url, setVideoUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videos, setvideos] = useState(false);
  const [video_title, set_video_title] = useState("");
  const [edit, setEdit] = useState(null);
  const columns = [
    {
      Header: "video_id",
      accessor: "video_id",
    },
    {
      Header: "course_name",
      accessor: "course_name",
    },
    {
      Header: "unit_name",
      accessor: "unit_name",
    },
    {
      Header: "video_title",
      Cell: (cell) => {
        return (
          <>
            <span
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {cell.cell.row.original?.video_title}
            </span>
          </>
        );
      },
    },
    {
      Header: "total_time",
      accessor: "total_time",
    },
    {
      Header: "total_enter",
      accessor: "total_enter",
    },
  ];

  useEffect(() => {
    getvideos();
  }, []);

  const getvideos = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/videos/student_videos_statistics.php",
        {
          student_id: location?.state?.student?.student_id,
        }
      );
      if (Array.isArray(get?.message)) setvideos(get.message);
      else setvideos([]);
    } catch (err) {
      setvideos([]);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div id="table-invoices-list">
            {!videos ? (
              <Loader />
            ) : videos?.length ? (
              <TableContainer
                columns={columns}
                data={videos}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Videos</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default StudentVideosStats;
