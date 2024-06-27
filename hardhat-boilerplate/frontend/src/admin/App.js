import React from "react";
import { ethers } from "ethers";
import VaultArtifact from "../contracts/Vault.json";
import vaultAddress from "../contracts/contract-Vault-address.json";
import CourseRegistrationArtifact from "../contracts/CourseRegistration.json";
import contractAddress from "../contracts/contract-Course-address.json";
import { NoWalletDetected } from "../components/NoWalletDetected";
import { Loading } from "../components/Loading";
import { AddCourseForm } from "./components/AddCourseForm";
import { EditCourseForm } from "./components/EditCourseForm";
import { DeleteCourseForm } from "./components/DeleteCourseForm";
import { CourseList } from "./components/CourseList";
import { Navbar, Nav, NavItem, Button, Card, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { NotificationForm } from "./components/NotificationForm";
import { AttendanceList } from "./components/AttendanceList";
import { WithdrawForm  } from "./components/WithdrawForm";
import axios from 'axios';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      courses: [],
      loading: false,
      error: null,
      successMessage: null,
      activeForm: null,
      showAttendanceList: false,
    };

    this.state = this.initialState;

    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      this.provider = new ethers.providers.JsonRpcProvider();
    }

    this.signer = this.provider.getSigner();
    this.contract = new ethers.Contract(
      contractAddress.CourseRegistration,
      CourseRegistrationArtifact.abi,
      this.signer
    );
    
    this.signer = this.provider.getSigner();
    this.vaultContract = new ethers.Contract(
      vaultAddress.Vault,
      VaultArtifact.abi,
      this.signer
    );
  }

  componentDidMount() {
    this.getCourses();
  }

  async getCourses() {
    try {
      const response = await axios.get('http://localhost:3001/api/getCourses');
      
      // Kiểm tra phản hồi từ backend
      if (!response.data || response.data.length === 0) {
        throw new Error("Courses data is empty or invalid format");
      }
  
      // Trích xuất dữ liệu khóa học từ phản hồi
      const courses = response.data.map(course => ({
        id: course.id,
        price: course.price,
        sessions: course.session, // Sửa thành sessions để phù hợp với trường dữ liệu từ backend
        status: course.status
      }));
  
      this.setState({ courses, loading: false });
    } catch (error) {
      console.error("Error getting courses:", error);
      this.setState({ error, loading: false });
    }
  }
  
  addCourse = async (id, price, sessions, status, image) => {
    try {
        // Chuyển đổi price từ EDU sang wei
        const priceWei = ethers.utils.parseUnits(price, "ether");

        console.log("Submitting Course with values:");
        console.log("ID:", id);
        console.log("Price (EDU):", price);
        console.log("Price (wei):", priceWei.toString());
        console.log("Sessions:", sessions);
        console.log("Status:", status);
        console.log("Image:", image);

        // Add to smart contract
        await this.contract.addCourse(
            ethers.BigNumber.from(id),
            priceWei, // Truyền price đã chuyển đổi sang wei
            ethers.BigNumber.from(sessions)
        );

        // Tạo FormData
        const formData = new FormData();
        formData.append("id", id.toString());
        formData.append("price", priceWei.toString()); // Truyền price đã chuyển đổi sang wei
        formData.append("sessions", sessions.toString());
        formData.append("status", status);
        formData.append("image", image);

        // Log formData entries
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Gọi API để thêm khóa học vào backend
        const response = await axios.post(
            "http://localhost:3001/api/addCourse",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log("Course added successfully to backend:", response.data);

        this.setState({
            successMessage: "Course added successfully!",
            activeForm: null,
        });

        setTimeout(() => {
            this.getCourses();
        }, 15000);
    } catch (error) {
        console.error("Error adding course:", error);
        this.setState({ error, loading: false });
    }
};


  editCourse = async (courseId, price, sessions, status, image) => {
    try {
      // Cập nhật thông tin trên smart contract
      console.log("Editing Course with values:");
      console.log("Course ID:", courseId);
      console.log("Price:", price);
      console.log("Sessions:", sessions);
      console.log("Status:", status);
      console.log("Image:", image);
      await this.contract.editCourse(
        courseId,
        ethers.BigNumber.from(price),
        sessions
      );

      // Sau khi cập nhật thành công trên smart contract, gọi phương thức để gửi dữ liệu xuống backend
      await this.editCourseBackend(courseId, price, sessions, status, image);
    } catch (error) {
      console.error("Error editing course:", error);
      this.setState({ error, loading: false });
    }
  };

  editCourseBackend = async (id, price, sessions, status, oldImage, newImageFile) => {
    try {
      // Tạo FormData
      const formData = new FormData();
      formData.append("id", id);
      formData.append("price", price);
      formData.append("sessions", sessions);
      formData.append("status", status); // Đảm bảo status được thêm vào formData
  
      // Nếu có file ảnh mới, thêm nó vào formData, ngược lại, thêm oldImage
      if (newImageFile) {
        formData.append("image", newImageFile);
      } else {
        formData.append("image", oldImage);
      }
  
      // Gọi API để cập nhật khóa học vào backend
      const response = await axios.put(
        "http://localhost:3001/api/editCourse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Course edited successfully on backend:", response.data);
  
      this.setState({
        successMessage: "Course edited successfully!",
        activeForm: null,
      });
  
      setTimeout(() => {
        this.getCourses();
      }, 15000);
    } catch (error) {
      console.error("Error editing course on backend:", error);
      this.setState({ error, loading: false });
    }
  };
  
  
  deleteCourse = async (courseId) => {
    try {
      await this.contract.removeCourse(courseId);
      this.setState({
        successMessage: "Course deleted successfully!",
        error: null, // Xóa thông báo lỗi nếu có
      });
      setTimeout(() => {
        this.getCourses();
      }, 15000);
    } catch (error) {
      console.error("Error deleting course:", error);
      let errorMessage = error.message || "Error deleting course";
      if (error.data && error.data.message) {
        errorMessage = error.data.message;
      }
  
      // Kiểm tra nội dung lỗi để hiển thị thông báo phù hợp cho người dùng
      if (errorMessage.includes("Khóa học có người đăng ký")) {
        alert("Khóa học có người đăng ký không thể xóa");
      } else {
        alert(errorMessage);
      }
  
      this.setState({ error: errorMessage });
    }
  };
  
    withdrawTokens = async (amount, recipient) => {
      try {
          // Chuyển đổi amount từ string sang BigNumber
          const amountBN = ethers.utils.parseUnits(amount, 18);

          console.log("Withdrawal initiated with amount:", amountBN.toString());
          console.log("Recipient:", recipient);

          // Gửi giao dịch rút Token
          const tx = await this.vaultContract.withdraw(amountBN, recipient);
          await tx.wait();
          
          // Log khi rút token thành công
          console.log("Transaction successful:", tx.hash);

          // Gửi dữ liệu xuống backend
          await this.sendWithdrawalData(amountBN, recipient, tx.hash);

          this.setState({ successMessage: "Token withdrawn successfully!" });
      } catch (error) {
          console.error("Error withdrawing tokens:", error);
          this.setState({ error, loading: false });
      }
  };

  sendWithdrawalData = async (amount, recipient, transactionHash) => {
      try {
          const data = {
              sender: this.senderAddress, // Thay bằng địa chỉ người gửi trong ứng dụng của bạn
              recipient: recipient,
              amount: amount.toString(),
              transactionHash: transactionHash,
              status: 'PENDING' // Mặc định là PENDING khi gửi lên backend
          };

          // Kiểm tra dữ liệu trước khi gửi xuống backend
          console.log("Sending withdrawal data to backend:", data);

          const response = await axios.post('http://localhost:3001/api/logTokenWithdrawal', data);
          console.log("Withdrawal data sent successfully:", response.data);
      } catch (error) {
          console.error("Error sending withdrawal data to backend:", error);
          throw error;
      }
  };


  closeActiveForm = () => {
    this.setState({ activeForm: null });
  };

  sendNotification = async (courseId, notification, zoomLink, sessionNumber) => {
    try {
      const id = parseInt(courseId);

      const response = await axios.get('http://localhost:3001/api/getAddress', {
        params: { id }
      });
      const addresses = response.data;

      await this.contract.sendNotification(courseId, notification, zoomLink, sessionNumber);

      const zoom_link = zoomLink;
      const session_number = sessionNumber;
      const saveResponse = await axios.post('http://localhost:3001/api/saveNotification', { id, notification, zoom_link, session_number });
      console.log('Notification saved successfully:', saveResponse.data);

      this.setState({
        successMessage: "Notification sent successfully!"
      });

    } catch (error) {
      console.error("Error sending notification:", error);
      this.setState({ error, loading: false });
    }
  };

  toggleAttendanceList = () => {
    this.setState((prevState) => ({
      showAttendanceList: !prevState.showAttendanceList
    }));
  };

  render() {
    const { courses, loading, error, activeForm } = this.state;

    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="container p-4">
        <Card className="text-center" style={{ backgroundColor: '#f5f5f5' }}>
          <Card.Body>
            <Card.Title>Welcome Admin</Card.Title>
          </Card.Body>
        </Card>
        <Navbar bg="light" expand="lg">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto justify-content-between w-100">
              <NavItem>
                <Button variant="primary" onClick={() => this.setState({ activeForm: 'add' })} className="mx-2">
                  Thêm khóa học
                </Button>
              </NavItem>
              <NavItem className="text-center">
                <Button variant="primary" onClick={() => this.setState({ activeForm: "notification" })} className="mx-2">
                  Thông báo khóa học
                </Button>
              </NavItem>
              <NavItem>
                <Button variant="primary" onClick={() => this.setState({ activeForm: 'edit' })} className="mx-2">
                  Chỉnh sửa khóa học
                </Button>
              </NavItem>
              <NavItem>
                <Button variant="primary" onClick={() => this.setState({ activeForm: 'attendance' })} className="mx-2">
                  Điểm danh
                </Button>
              </NavItem>
              <NavItem>
                <Button variant="primary" onClick={() => this.setState({ activeForm: 'course' })} className="mx-2">
                  Lớp học
                </Button>
              </NavItem>
              <NavItem>
                <Button variant="primary" onClick={() => this.setState({ activeForm: 'withdraw' })} className="mx-2">
                 Rút Token
                </Button>
              </NavItem>
              <NavItem>
                <Button variant="danger" onClick={() => this.setState({ activeForm: 'delete' })} className="mx-2">
                  Xóa khóa học
                </Button>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container>
          <Row className="justify-content-md-center">
            {error && <div className="alert alert-danger">{error.message}</div>}
            <Col md={6}>
              {activeForm === 'add' && <AddCourseForm onSubmit={this.addCourse} onClose={this.closeActiveForm} />}
              {activeForm === 'edit' && <EditCourseForm 
                id={this.state.editingCourseId} 
                price={this.state.editingCoursePrice} 
                sessions={this.state.editingCourseSessions}
                status={this.state.editingCourseStatus}
                image={this.state.editingCourseImage}
                onSubmit={(id, price, sessions, status, image) => this.editCourse(id, price, sessions, status, image)} 
                onClose={this.closeActiveForm} 
              />}

              {activeForm === 'delete' && <DeleteCourseForm onSubmit={this.deleteCourse} onClose={this.closeActiveForm} />}
              {activeForm === 'notification' && <NotificationForm onSubmit={this.sendNotification} onClose={this.closeActiveForm} />}
              {activeForm === 'attendance' && <AttendanceList />}
              {activeForm === 'course' && <CourseList courses={courses} />}
              {activeForm === 'withdraw' && <WithdrawForm onSubmit={this.withdrawTokens} onClose={this.closeActiveForm} />}
              <hr />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}