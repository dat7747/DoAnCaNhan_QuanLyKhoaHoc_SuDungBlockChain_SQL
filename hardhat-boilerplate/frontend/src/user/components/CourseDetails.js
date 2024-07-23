import React from "react";
import { Modal, Button, Image } from "react-bootstrap";
import axios from "axios";
import '../../css/CourseDetails.css'; // Import CSS cho chi tiết lớp học

class CourseDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseDetails: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchCourseDetails();
    }

    async fetchCourseDetails() {
        const { courseId } = this.props;
        try {
            const response = await axios.get(`http://localhost:3001/api/getClassDetails?courseId=${courseId}`);
            console.log("Data received from API:", response.data); // Log dữ liệu nhận được từ API
            this.setState({ courseDetails: response.data.data[0], loading: false });
        } catch (error) {
            console.error("Error fetching course details:", error); // Log lỗi nếu có
            this.setState({ error: "Không thể lấy thông tin chi tiết lớp học", loading: false });
        }
    }

    render() {
        const { courseDetails, loading, error } = this.state;
        const { onClose } = this.props;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        return (
            <Modal show={true} onHide={onClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết lớp học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {courseDetails ? (
                        <div className="course-details">
                            {courseDetails.image && (
                                <div className="course-image">
                                    <Image src={`http://localhost:3001/uploads/${courseDetails.image}`} fluid />
                                </div>
                            )}
                            <h3>{courseDetails.className}</h3>
                            <p>{courseDetails.classDescription}</p>
                            <p>Thời gian bắt đầu: {new Date(courseDetails.startTime).toLocaleString()}</p>
                            <p>Thời gian kết thúc: {new Date(courseDetails.endTime).toLocaleString()}</p>
                            <p>Giá: {courseDetails.price} EDU</p>
                            <p>Số buổi: {courseDetails.session}</p>
                            {/* Nếu bạn có thêm thông tin khác, hãy hiển thị ở đây */}
                        </div>
                    ) : (
                        <p>Không có thông tin chi tiết cho khóa học này.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CourseDetails;
