import React from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router,Switch, Route, Link } from "react-router-dom";
import CourseRegistrationArtifact from "../contracts/CourseRegistration.json";
import contractAddress from "../contracts/contract-Course-address.json";
import TokenArtifact from "../contracts/Token.json";
import tokenContractAddress from "../contracts/contract-Token-address.json";
import ownerAddress from "../contracts/owner-address.json";
import { NoWalletDetected } from "../components/NoWalletDetected";
import { Loading } from "../components/Loading";
import { ViewCardCourse } from "./components/ViewCardCourse";
import  NFTDisplay  from "./components/NFTDisplay";
import { Card, Container, Row } from "react-bootstrap";
import axios from 'axios';
import NFT_address from "../contracts/contract-Hero-address.json";
import { WalletConnector } from "./components/WalletConnector";

export class App_User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      loading: false,
      error: null,
      successMessage: null,
      processingTransaction: false,
      selectedCourseId: null  // Thêm selectedCourseId vào state của App_User
    };

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

    this.tokenContract = new ethers.Contract(
      tokenContractAddress.Token,
      TokenArtifact.abi,
      this.signer
    );
  }

  async sendDataToBackend(courseId, gmail, address, selectedCourseId) {
    try {
      const id = courseId;
      const response = await axios.post('http://localhost:3001/api/addData', { id, gmail, address });
      console.log('Data added successfully:', response.data);
    } catch (error) {
      console.error('Failed to add data:', error);
    }
  }

  componentDidMount() {
    this.getCourses();
  }

  async getCourses() {
    try {
      const response = await axios.get('http://localhost:3001/api/getCourses'); // Đảm bảo đường dẫn endpoint chính xác
      const courses = response.data; // Giả sử dữ liệu được trả về là mảng các khóa học
      this.setState({ courses, loading: false });
    } catch (error) {
      console.error("Error getting courses from backend:", error);
      this.setState({ error, loading: false });
    }
  }
  async registerCourse(courseId) {
    try {
      const course = this.state.courses.find(course => course.id === courseId);
      if (!course) {
        throw new Error("Course not found");
      }
  
      const signerAddress = await this.signer.getAddress();
      const price = course.price;
  
      const balance = await this.tokenContract.balanceOf(signerAddress);
      if (balance.lt(price)) {
        throw new Error("Insufficient balance to register for this course");
      }
  
      this.courseRegistrationContract = new ethers.Contract(
        contractAddress.CourseRegistration,
        CourseRegistrationArtifact.abi,
        this.signer
      );
  
      // Call the smart contract function
      const receipt = await this.courseRegistrationContract.register(courseId);
      console.log("receipt: " ,receipt);
      await receipt.wait(); // Chờ đợi cho đến khi giao dịch được xác nhận
      const transactionHash = receipt.hash;
  
      // Get transaction receipt
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
  
      // Check if transactionReceipt is valid
      if (!transactionReceipt) {
        throw new Error("Transaction receipt is null");
      }
  
      // Update selectedCourseId in state
      this.setState({ selectedCourseId: courseId });
  
      // Prepare data to send to backend
      const registrationInfo = {
        courseId: courseId,
        senderAddress: signerAddress,
        transactionHash: transactionReceipt.transactionHash
      };
  
      // Log data before sending to backend
      console.log('Sending registration info to backend:', registrationInfo);
  
      // Send registration info to backend
      await axios.post('http://localhost:3001/api/addRegistration', registrationInfo);
  
      // Update state and fetch courses again
      this.setState({ successMessage: "Đăng ký thành công!" });
      await this.getCourses();
    } catch (error) {
      console.error("Error registering course:", error);
      this.setState({ error, loading: false });
    } finally {
      this.setState({ processingTransaction: false });
    }
  }
  
  render() {
    const { courses, loading, error, successMessage, processingTransaction, selectedCourseId } = this.state;

    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <Router>
        <div className="container full">
          <Card className="text-center" style={{ backgroundColor: "#f5f5f5" }}>
            <Card.Body>
              <Card.Title>Welcome User To Courses</Card.Title>
              <WalletConnector onLogin={this.props.onLogin} />
            </Card.Body>
          </Card>

          <nav>
            <ul>
              <li>
                <Link to="/course">Course</Link>
              </li>
              <li>
                <Link to="/nft-market">NFT Market</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route exact path="/course">
              <ViewCardCourse
                courses={courses}
                error={error}
                onRegister={this.registerCourse.bind(this)}
                tokenContract={this.tokenContract}
                ownerAddress={ownerAddress}
                processingTransaction={processingTransaction}
                selectedCourseId={selectedCourseId}
                sendDataToBackend={(courseId, email, address) => this.sendDataToBackend(courseId, email, address, selectedCourseId)} />
            </Route>
            <Route path="/nft-market">
              <NFTDisplay
                contractAddress={NFT_address.Hero}
                tokenId={123} // Thay đổi tokenId tương ứng với NFT cụ thể
                provider={this.provider} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
