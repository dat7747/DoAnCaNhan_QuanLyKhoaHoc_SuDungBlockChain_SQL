import React from "react";
import { Card, Button, Form, Modal, Col, Container, Row } from "react-bootstrap";
import '../../css/ViewCardCourse.css'; // Import the enhanced CSS

export class ViewCardCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            showModal: false,
            selectedCourse: null
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSendEmail = this.handleSendEmail.bind(this);
        this.handleShowDetails = this.handleShowDetails.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    async handleSendEmail() {
        const { email } = this.state;
        const { selectedCourseId, sendDataToBackend } = this.props;
        const address = window.ethereum.selectedAddress;

        console.log("Sending email:", selectedCourseId, email, address);
        await sendDataToBackend(selectedCourseId, email, address);
        alert("Email đã được gửi thành công!");
        this.setState({ email: "" });
    }

    formatPrice(price) {
        const priceString = price.toString();
        if (priceString.length > 18) {
            const wholePart = priceString.slice(0, priceString.length - 18);
            const decimalPart = priceString.slice(priceString.length - 18).replace(/0+$/, "");
            return `${wholePart}.${decimalPart} EDU`;
        }
        return `${priceString} EDU`;
    }

    handleShowDetails(course) {
        this.setState({ showModal: true, selectedCourse: course });
    }

    handleCloseModal() {
        this.setState({ showModal: false, selectedCourse: null });
    }

    render() {
        const { courses, processingTransaction } = this.props;
        const { email, showModal, selectedCourse } = this.state;

        return (
            <div className="view-card-course">
                <h2>Các lớp học hiện tại</h2>
                <Container>
                    <Row xs={1} md={3} lg={4} className="g-4">
                        {courses && courses.length > 0 ? (
                            courses.map((course) => (
                                course.status === "open" && (
                                    <Col key={course.id}>
                                        <Card>
                                            {course.image && (
                                                <Card.Img variant="top" src={`http://localhost:3001/uploads/${course.image}`} style={{ height: "200px", objectFit: "cover" }} />
                                            )}
                                            <Card.Body>
                                                <Card.Title>Course ID: {course.id}</Card.Title>
                                                <Card.Text>
                                                    Price: {this.formatPrice(course.price)} <br />
                                                    Sessions: {course.session}
                                                </Card.Text>
                                                <div className="d-flex justify-content-between">
                                                    <Button variant="primary" onClick={() => this.props.onRegister(course.id, course.price)} disabled={processingTransaction}>
                                                        Register
                                                    </Button>
                                                    <Button variant="primary" onClick={() => this.handleShowDetails(course)}>
                                                        See details
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            ))
                        ) : (
                            <p>Không có khóa học nào để hiển thị.</p>
                        )}
                    </Row>
                </Container>
                {this.props.selectedCourseId && (
                    <Modal show={true}>
                        <Modal.Header closeButton={false}>
                            <Modal.Title>Thông báo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Đăng ký thành công! Vui lòng nhập email của bạn để nhận thông tin khóa học.</p>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={this.handleEmailChange} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleSendEmail}>Send Email</Button>
                        </Modal.Footer>
                    </Modal>
                )}
                {showModal && selectedCourse && (
                    <Modal show={showModal} onHide={this.handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Chi tiết khóa học</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p><strong>Course ID:</strong> {selectedCourse.id}</p>
                            <p><strong>Price:</strong> {this.formatPrice(selectedCourse.price)} EDU</p>
                            <p><strong>Sessions:</strong> {selectedCourse.session}</p>
                            <p><strong>Description:</strong> {selectedCourse.description}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
        );
    }
}

export default ViewCardCourse;
