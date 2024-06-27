import React, { useState } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';

export function WithdrawForm({ onSubmit, onClose }) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!amount || !recipient) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await onSubmit(amount, recipient);
      setAmount('');
      setRecipient('');
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rút Token</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formAmount">
            <Form.Label>Số lượng Token</Form.Label>
            <Form.Control
              type="number"
              placeholder="Nhập số lượng"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRecipient">
            <Form.Label>Địa chỉ người nhận</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập địa chỉ"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="d-block mx-auto">
            Rút
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
