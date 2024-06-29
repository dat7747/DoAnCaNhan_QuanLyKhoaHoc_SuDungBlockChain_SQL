import React from "react";
import { Card, Button, Form, Modal, Col, Container, Row } from "react-bootstrap";

export class ViewCardCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ""
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSendEmail = this.handleSendEmail.bind(this);
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
        // Chuyển đổi giá thành chuỗi
        const priceString = price.toString();

        // Nếu giá trị có nhiều hơn 18 chữ số, hiển thị ở dạng chuẩn
        if (priceString.length > 18) {
            const wholePart = priceString.slice(0, priceString.length - 18);
            const decimalPart = priceString.slice(priceString.length - 18).replace(/0+$/, "");
            return `${wholePart}.${decimalPart} EDU`;
        }

        // Nếu giá trị có ít hơn hoặc bằng 18 chữ số, hiển thị ở dạng bình thường
        return `${priceString} EDU`;
    }

    render() {
        const { courses, processingTransaction } = this.props;
        const { email } = this.state;

        return (
            <div className="view-card-course" style={{ backgroundColor: "#87CEEB" }}>
                <h2 className="text-center">Các lớp học hiện tại</h2>
                <Container>
                    <Row xs={1} md={4} className="g-4">
                        {courses && courses.length > 0 ? (
                            courses.map((course) => (
                                course.status === "open" && (
                                    <Col key={course.id}>
                                        <Card>
                                            {course.image && (
                                                <Card.Img variant="top" src={`http://localhost:3001/uploads/${course.image}`} style={{ height: "150px", objectFit: "cover" }} />
                                            )}
                                            <Card.Body>
                                                <Card.Title>Course ID: {course.id}</Card.Title>
                                                <Card.Text>
                                                    Price: {this.formatPrice(course.price)} <br />
                                                    Sessions: {course.session}
                                                </Card.Text>

                                                <div style={{ textAlign: "center" }}>
                                                    <Button variant="primary" onClick={() => this.props.onRegister(course.id, course.price)} disabled={processingTransaction}>Register</Button>
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
            </div>
        );
    }
}
