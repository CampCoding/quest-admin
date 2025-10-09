import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

function ShowHideAgendaPdf({ modal, setModal, getData }) {
  const deleteAgenda = async () => {
    console.log(modal);

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/courses/delete_agenda_pdf.php",
        {
          grade_id: modal?.grade_id,
          pdf_id: modal?.pdf_id,
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
    <Modal isOpen={modal} toggle={() => setModal(false)} onC>
      <ModalHeader toggle={() => setModal(false)} tag="h4">
        {"Delete"} Agenda
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
              <h1>Are You Sure {"Delete"} Agenda ..?</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-success save-user"
                  onClick={() => deleteAgenda()}
                >
                  Confirm
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default ShowHideAgendaPdf;
