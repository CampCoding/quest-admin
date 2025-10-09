import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const MatchingAnswerModal = ({
  show,
  handleClose,
  getAnswers,
  matching_header_id,
  answers,
}) => {
  const [answerData, setAnswerData] = useState({
    matching_header_id: matching_header_id,
    right_side_value: "",
    left_side_value: "",
  });

  useEffect(() => {
    setAnswerData({
      matching_header_id: matching_header_id,
      right_side_value: "",
      left_side_value: "",
    });
  }, [matching_header_id]);

  const handleChange = (field, value) => {
    setAnswerData({ ...answerData, [field]: value });
  };

  const addAnswer = async () => {
    try {
      const response = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/matching_qs/insert_answers.php",
        JSON.stringify({ ...answerData, matching_header_id })
      );

      if (response.status === "success") {
        toast.success("Answer added successfully");
        handleClose();
        if (getAnswers) {
          getAnswers();
        }
      } else {
        toast.error("Failed to add answer");
      }
    } catch (error) {
      console.error("Error adding answer:", error);
      toast.error("Error when adding answer");
    }
  };

  const deleteAnswer = async (matching_qs_id) => {
    try {
      const response = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/matching_qs/delete_answer.php",
        JSON.stringify({ matching_qs_id })
      );

      if (response.status === "success") {
        toast.success("Answer deleted successfully");
        if (getAnswers) {
          getAnswers();
        }
      } else {
        toast.error("Failed to delete answer");
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
      toast.error("Error when deleting answer");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Matching Answer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="rightSideValue">
            <Form.Label>Right Side Value</Form.Label>
            <Form.Control
              type="text"
              value={answerData.right_side_value}
              onChange={(e) => handleChange("right_side_value", e.target.value)}
              placeholder="Enter right side value"
            />
          </Form.Group>
          <Form.Group controlId="leftSideValue" className="mt-3">
            <Form.Label>Left Side Value</Form.Label>
            <Form.Control
              type="text"
              value={answerData.left_side_value}
              onChange={(e) => handleChange("left_side_value", e.target.value)}
              placeholder="Enter left side value"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addAnswer}>
          Add Answer
        </Button>
      </Modal.Footer>
      <hr />
      <h5 style={{ padding: "0 20px" }}>Existing Answers</h5>
      {answers && answers.length > 0 ? (
        <ul
          className="danger-ext-ans"
          style={{ padding: "0 30px", margin: "28px 0", listStyle: "none" }}
        >
          {answers.map((answer) => (
            <li
              style={{
                padding: "0 30px",
                width: "100%",
                margin: "28px 0",
                display: "flex",
              }}
              key={answer.matching_qs_id}
            >
              {answer.left_side_value} - {answer.right_side_value}
              <Button
                variant="danger"
                size="sm"
                className="ms-2"
                style={{
                  maxWidth: "130px !important",
                  margin: "0 auto !important",
                }}
                onClick={() => deleteAnswer(answer.matching_qs_id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No answers available</p>
      )}
    </Modal>
  );
};

export default MatchingAnswerModal;
