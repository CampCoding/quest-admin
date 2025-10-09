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

const StudentBookStats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  document.title = "E-Book Store | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [book, setBook] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ebooks, setEbooks] = useState(false);
  const [book_title, set_book_title] = useState("");
  const [edit, setEdit] = useState(null);
  const columns = [
    {
      Header: "book_id",
      accessor: "book_id",
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
      Header: "book_title",
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
              {cell.cell.row.original?.book_title}
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
    getEbooks();
  }, []);

  const getEbooks = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/student_book_statistics.php",
        {
          student_id: location?.state?.student?.student_id,
        }
      );
      if (Array.isArray(get?.message)) setEbooks(get.message);
      else setEbooks([]);
    } catch (err) {
      setEbooks([]);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div id="table-invoices-list">
            {!ebooks ? (
              <Loader />
            ) : ebooks?.length ? (
              <TableContainer
                columns={columns}
                data={ebooks}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No EBooks</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default StudentBookStats;
