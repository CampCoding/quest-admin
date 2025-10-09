import React, { useState } from "react";
import {
  Col,
  Container,
  DropdownItem,
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

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TableContainer from "../../components/Common/TableContainer";
import { Loader } from "rsuite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Icon } from "@iconify/react";
import {
  ContentCopyOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import CopyToClipboard from "react-copy-to-clipboard";
import { userData } from "../../store/getProfileData";
import ReactSelect from "react-select";
// import CourseListTable from "../CourseTable/courseListTable";

const VoiceStoreUnit = ({ CourseId, allunitdata }) => {
  const navigate = useNavigate();
  document.title = "Voices | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [voice, setVoice] = useState(false);
  const [voice_url, setVoiceUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState(false);
  const [voice_title, set_voice_title] = useState("");
  const [edit, setEdit] = useState(null);
  const [voiceId, setVoiceId] = useState(null);
  const columns = [
    {
      Header: "voice_code",
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
              text={cell.cell.row.original?.voice_id}
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
                  {cell.cell.row.original?.voice_id}
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
      Header: "Voice title",
      accessor: "title",
    },
    {
      Header: "Voice",
      Cell: (cell) => {
        return (
          <>
            <audio
              style={{ width: "100px", height: "40px" }}
              className="audio"
              src={cell?.cell?.row?.original?.voice_link}
              controls
            ></audio>
          </>
        );
      },
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
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  onClick={() => {
                    setEdit(cell.cell.row.original);
                  }}
                >
                  Un Assign
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    if (edit) {
      setVoiceUrl(edit?.voice_url);
      setNumberOfPages(edit?.pages_count);
      set_voice_title(edit?.voice_title);
    }
  }, [edit]);
  useEffect(() => {
    getVoices();
  }, []);
  // console.log(allunitdata)
  const getVoices = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/voices/select_unit_voices.php",
        {
          unit_id: allunitdata?.unit_id,
        }
      );
      if (Array.isArray(get?.message)) setVoices(get.message);
      else setVoices([]);
    } catch (err) {
      setVoices([]);
    }
  };
  const [allVoices, setAllVoices] = useState([]);
  const getAllVoices = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/voices/select_voices.php"
      );
      if (Array.isArray(get?.message)) setAllVoices(get.message);
      else setAllVoices([]);
    } catch (err) {
      setAllVoices([]);
    }
  };
  useEffect(() => {
    getAllVoices();
  }, []);
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      // No file selected
      return;
    }
    setVoice(file);
    var reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    reader.onloadend = function () {
      var count = reader.result.match(/\/Type[\s]*\/Page[^s]/g)?.length;
      if (count) {
        setNumberOfPages(count);
        set_voice_title(file?.name);
      } else {
        setNumberOfPages(false);
        set_voice_title("");
      }
    };
  };
  const uploadPdf = async () => {
    setLoading(true);
    const formData = new FormData();
    if (voice) {
      formData.append("file_attachment", voice);
      const url = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/voices/uploud_voice.php",
        formData
      );
      if (url.status == "success") {
        setVoiceUrl(url.message);
        toast.success("File Uploaded Successfully");
      } else {
        toast.error(url.message);
      }
    }
    setLoading(false);
  };
  const addVoice = async (e) => {
    const data_send = {
      unit_id: allunitdata?.unit_id,
      course_id: allunitdata?.course_id,
      voice_id: voiceId,
    };

    // https://camp-coding.tech/quest/platform/admin/voices/insert_voices.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/voices/assign_voice_unit.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setVoice(false);
      getVoices();
      set_voice_title("");
      toggle();
      setVoiceUrl(false);
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
  };

  const deleteVoice = async (e) => {
    const data_send = {
      unit_id: allunitdata?.unit_id,
      course_id: allunitdata?.course_id,
      voice_id: edit?.voice_id,
    };

    // https://camp-coding.tech/quest/platform/admin/voices/insert_voices.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/voices/delete_from_assign.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Un Assigned");
      setEdit(null);
      getVoices();
    } else {
      toast.error(add.message);
    }
  };

  const editVoice = async (e) => {
    if (voice && !voice_url && !voice_url?.length) {
      return toast.error("Upload Voice First");
    }
    const data_send = {
      voice_title:
        e.currentTarget.voice_title.value &&
        e.currentTarget.voice_title.value?.length
          ? e.currentTarget.voice_title.value
          : voice_title,
      voice_url: voice_url,
      voice_id: edit?.voice_id,
      page_count: numberOfPages,
    };

    // https://camp-coding.tech/quest/platform/admin/voices/insert_voices.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/voices_store/update_voice_info.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Updated");
      setVoice(false);
      getVoices();
      setEdit({});
      setVoiceUrl(false);
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
  };
  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="header-btns">
            {true ? (
              <button
                className="btn btn-success"
                onClick={() => {
                  setmodal(true);
                }}
              >
                Assign New voice
              </button>
            ) : null}
          </div>
          <div id="table-invoices-list">
            {!voices ? (
              <Loader />
            ) : voices?.length ? (
              <TableContainer
                columns={columns}
                data={voices}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Voices</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Assign New Voice
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addVoice(e);
              return false;
            }}
          >
            <Row className={"my-5"}>
              <ReactSelect
                onChange={(e) => setVoiceId(e?.value)}
                options={allVoices?.map((item) => ({
                  label: item?.title,
                  value: item?.voice_id,
                }))}
              />
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-success save-user">
                    Save
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      <Modal isOpen={edit} toggle={() => setEdit(false)}>
        <ModalHeader toggle={() => setEdit(false)} tag="h4">
          Edit Voice
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              deleteVoice(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Are You Sure ..?</Label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-success save-user">
                    Confirm
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default VoiceStoreUnit;
