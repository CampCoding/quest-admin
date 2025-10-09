import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  ModalBody,
  ModalHeader,
  Form,
  Modal,
  Label,
  Input,
} from "reactstrap";
import { uploadPdf } from "./uploadPdf";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";

function AddAgendaPdf({ modal, setModal, getData }) {
  const [data, setData] = useState({});
  const { univ_id, grade_id } = useParams();
  const uploadAgenda = async () => {
    let aFile = null;
    if (data?.file) {
      aFile = await uploadPdf(data?.file);
    }
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/courses/add_agenda_pdf.php",
        {
          grade_id: grade_id,
          pdf_url: aFile?.message,
        }
      )
      .then((res) => {
        toast.dark(res?.message);
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal isOpen={modal} toggle={() => setModal(false)}>
      <ModalHeader toggle={setModal} tag="h4">
        Add Agenda
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            return false;
          }}
        >
          <Row>
            <Col md={12}>
              <div className="mb-3">
                <Label className="form-label">Agenda File</Label>
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
                    onChange={(e) =>
                      setData({ ...data, file: e.target.files[0] })
                    }
                  />{" "}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-success save-user"
                  onClick={() => uploadAgenda()}
                >
                  Save
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default AddAgendaPdf;
