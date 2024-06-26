import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export const NotificationForm = ({ onSubmit }) => {
  const [courseId, setCourseId] = useState("");
  const [notification, setNotification] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [sessionNumber, setSessionNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(courseId, notification, zoomLink, sessionNumber);
  };

  return (
    
    <Form onSubmit={handleSubmit}>
       <h2 className="my-4 text-center">Course announcement</h2>
      <Form.Group controlId="courseId">
        <Form.Label>Course ID</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="notification">
        <Form.Label>Notification</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Notification"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="zoomLink">
        <Form.Label>Zoom Link</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Zoom Link"
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="sessionNumber">
        <Form.Label>Session Number</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Session Number"
          value={sessionNumber}
          onChange={(e) => setSessionNumber(e.target.value)}
          required
        />
      </Form.Group>
      <Button className="d-block mx-auto" variant="primary" type="submit">
        Send Notification
      </Button>
    </Form>
  );
};
