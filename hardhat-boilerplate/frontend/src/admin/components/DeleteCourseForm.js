import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

export const DeleteCourseForm = ({ onSubmit, error }) => {
  const [courseId, setCourseId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(courseId);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>} {/* Hiển thị thông báo lỗi */}
      <div className="text-center mb-3">
        <Form.Label className="mx-auto"><h2>Course ID</h2></Form.Label>
        <Form.Control
          type="text"
          className="mx-auto"
          style={{ maxWidth: "300px" }}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
      </div>
      <div className="text-center">
        <Button variant="danger" type="submit" className="mx-auto">
          Delete Course
        </Button>
      </div>
    </Form>
  );
};
