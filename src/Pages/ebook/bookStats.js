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

const EbookStats = () => {
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
  console.log(location?.state?.book?.book_id);
  const columns = [
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
      Header: "total_time",
      accessor: "total_time",
    },
    {
      Header: "book_enter_count",
      accessor: "book_enter_count",
    },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <>
            <UncontrolledDropdown>
              <DropdownToggle
                className="btn btn-light btn-sm"
                tag="button"
                data-bs-toggle="dropdown"
                direction="start"
              >
                <i className="bx bx-dots-horizontal-rounded"></i>
              </DropdownToggle>

              <DropdownMenu
                className="dropdown-menu-end"
                style={{ width: "100%", textAlign: "center" }}
              >
                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate("/StudentBookStats", {
                      state: { student: cell?.cell?.row?.original },
                    })
                  }
                >
                  Student Stats
                </button>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getEbooks();
  }, []);

  const getEbooks = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/book_statistics.php",
        {
          book_id: location?.state?.book?.book_id,
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

export default EbookStats;
