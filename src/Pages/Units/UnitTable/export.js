import axios from "axios";
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
import { Loader } from "rsuite";

function ExportFile({ modal, setModal, type }) {
  const [count, setCount] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState(0);
  const DownloadAllQuestions = async () => {
    setDownloadLoading(true);
    const dataSend =
      type == "unit"
        ? {
            course_id: modal.course_id,
            unit_id: modal.unit_id,
            count: count,
          }
        : type == "topic"
        ? {
            course_id: modal?.course_id,
            unit_id: modal?.unit_id,
            topic_label: modal?.topic_label,
            count: count,
          }
        : type == "exam"
        ? {
            exam_id: modal?.exam_id,
            count: count,
          }
        : {};
    try {
      const Download = await axios.post(
        type == "unit"
          ? "https://camp-coding.tech/quest/platform/admin/excil_data/MCQ/export_test_mcq.php"
          : type == "topic"
          ? "https://camp-coding.tech/quest/platform/admin/excil_data/MCQ/export_test_mcq_by_topic.php"
          : "https://camp-coding.tech/quest/platform/admin/excil_data/MCQ/export_test_mcq_by_exam.php",
        dataSend
      );
      window.open(Download, "_blanck");
      setDownloadLoading(false);
    } catch (e) {
      console.log(e);
      setDownloadLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)}>
      <ModalHeader toggle={() => setModal(false)} tag="h4">
        Export File
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (!downloadLoading) {
              DownloadAllQuestions();
            }
            return false;
          }}
        >
          <Row>
            <Col md={12}>
              <div className="mb-3">
                <Label className="form-label">Questions Number</Label>
                <Input
                  name="quesntions_number"
                  type="text"
                  onChange={(e) => setCount(e.target.value)}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-end">
                {downloadLoading ? (
                  <Loader />
                ) : (
                  <button type="submit" className="btn btn-success save-user">
                    Export
                  </button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default ExportFile;
