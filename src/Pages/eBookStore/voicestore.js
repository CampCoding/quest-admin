import React, { useState } from "react";
import {
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import { Icon } from "@iconify/react";
import { ContentCopyOutlined } from "@mui/icons-material";
import axios from "axios";
import { useCallback, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import TableContainer from "../../components/Common/TableContainer";
import { uploadBunny } from "../Units/UnitTable/TrueFalseQuestions/uploadBunny";
// import CourseListTable from "../CourseTable/courseListTable";

const VoiceStore = () => {
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

    // {
    //   Header: "Action",
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         <UncontrolledDropdown>
    //           <DropdownToggle
    //             className="btn btn-light btn-sm"
    //             tag="button"
    //             data-bs-toggle="dropdown"
    //             direction="start"
    //           >
    //             <i className="bx bx-dots-horizontal-rounded"></i>
    //           </DropdownToggle>
    //           <DropdownMenu className="dropdown-menu-end">

    //               <DropdownItem
    //                 onClick={() => {
    //                   setEdit(cell.cell.row.original);
    //                 }}
    //               >
    //                 Edit
    //               </DropdownItem>
    //           </DropdownMenu>
    //         </UncontrolledDropdown>
    //       </>
    //     );
    //   },
    // },
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

  const getVoices = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/voices/select_voices.php"
      );
      if (Array.isArray(get?.message)) setVoices(get.message);
      else setVoices([]);
    } catch (err) {
      setVoices([]);
    }
  };
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
  const [uploadVideo, setUploadVideo] = useState(null);
  const [suploadProgress, setUploadProgress] = useState(0);
  const [setVoicesData, voicesData] = useState({});
  const uploadPdf = async () => {
    setLoading(true);
    const formData = new FormData();
    if (voice) {
      formData.append("voice", voice);

      let bunnyVideo = await uploadBunny(
        setUploadVideo,
        setUploadProgress,
        setVoiceUrl,
        voice,
        "Voice"
      );

      setVoiceUrl(bunnyVideo);
      setUploadVideo(false);
      setLoading(false);
    }
    //   const url = await axios.post(
    //     "https://camp-coding.tech/quest/platform/admin/voices/uploud_voice.php",
    //     formData
    //   );
    //   setVoiceUrl(url);
    //   console.log(url);
    //   toast.dark(url);
    // }
    // setLoading(false);
  };
  const addVoice = async (e) => {
    if (!voice_url && !voice_url?.length) {
      return toast.error("Upload Voice First");
    }
    const data_send = {
      title:
        e.currentTarget.voice_title.value &&
        e.currentTarget.voice_title.value?.length
          ? e.currentTarget.voice_title.value
          : voice_title,
      voice_link: voice_url,
    };

    // https://camp-coding.tech/quest/platform/admin/voices/insert_voices.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/voices/add_voices.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setVoice(false);
      getVoices();
      set_voice_title("");

      setVoiceUrl(false);
      setNumberOfPages(false);
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
            {
              <button
                className="btn btn-success"
                onClick={() => {
                  setmodal(true);
                }}
              >
                Add New voice
              </button>
            }
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
          Add New Voice
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addVoice(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Voice Title</Label>
                  <Input
                    name="voice_title"
                    type="text"
                    defaultValue={voice_title}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">voice file</Label>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <input
                      type="file"
                      id="pdfInput"
                      accept=".pdf"
                      onChange={handleFileSelect}
                    />{" "}
                    <span
                      className="btn btn-primary"
                      onClick={() => uploadPdf()}
                    >
                      {!loading ? (
                        <Icon icon="solar:upload-bold-duotone" />
                      ) : (
                        <Loader size="sm" />
                      )}
                    </span>
                  </div>
                  <h4>
                    {numberOfPages ? (
                      <span>numberOfPages : {numberOfPages}</span>
                    ) : null}
                  </h4>
                </div>
              </Col>
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
              editVoice(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Voice Title</Label>
                  <Input
                    name="voice_title"
                    type="text"
                    defaultValue={edit?.voice_title}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">voice file</Label>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <input
                      type="file"
                      id="pdfInput"
                      accept=".pdf"
                      onChange={handleFileSelect}
                    />{" "}
                    <span
                      className="btn btn-primary"
                      onClick={() => uploadPdf()}
                    >
                      {!loading ? (
                        <Icon icon="solar:upload-bold-duotone" />
                      ) : (
                        <Loader size="sm" />
                      )}
                    </span>
                  </div>
                  <h4>
                    {numberOfPages ? (
                      <span>numberOfPages : {numberOfPages}</span>
                    ) : null}
                  </h4>
                </div>
              </Col>
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
    </React.Fragment>
  );
};

export default VoiceStore;
