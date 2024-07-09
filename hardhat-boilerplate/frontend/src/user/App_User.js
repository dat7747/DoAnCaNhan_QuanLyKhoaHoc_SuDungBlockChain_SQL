import React from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CourseRegistrationArtifact from "../contracts/CourseRegistration.json";
import contractAddress from "../contracts/contract-Course-address.json";
import TokenArtifact from "../contracts/Token.json";
import tokenContractAddress from "../contracts/contract-Token-address.json";
import ownerAddress from "../contracts/owner-address.json";
import { NoWalletDetected } from "../components/NoWalletDetected";
import { Loading } from "../components/Loading";
import { ViewCardCourse } from "./components/ViewCardCourse";
import NFTDisplay from "./components/NFTDisplay";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import NFT_address from "../contracts/contract-Hero-address.json";
import { WalletConnector } from "./components/WalletConnector";

export class App_User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      loadingCourses: true,
      errorCourses: null,
      successMessage: null,
      processingTransaction: false,
      selectedCourseId: null,
      nfts: [],
      loadingNFTs: true,
      errorNFTs: null,
      selectedTab: "course"
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

  async componentDidMount() {
    this.getCourses();
    this.fetchNFTs(); // Gọi hàm để lấy danh sách NFT khi component được gắn kết
  }

  async sendDataToBackend(courseId, gmail, address, selectedCourseId) {
    try {
      const id = courseId;
      const response = await axios.post("http://localhost:3001/api/addData", {
        id,
        gmail,
        address
      });
      console.log("Data added successfully:", response.data);
    } catch (error) {
      console.error("Failed to add data:", error);
    }
  }

  async getCourses() {
    try {
      const response = await axios.get("http://localhost:3001/api/getCourses"); // Đảm bảo đường dẫn endpoint chính xác
      const courses = response.data; // Giả sử dữ liệu được trả về là mảng các khóa học
      this.setState({ courses, loadingCourses: false });
    } catch (error) {
      console.error("Error getting courses from backend:", error);
      this.setState({ errorCourses: error, loadingCourses: false });
    }
  }

  async fetchNFTs() {
    try {
      const address = await this.signer.getAddress();
      const nftContract = new ethers.Contract(
        NFT_address.Hero,
        [
          "function balanceOf(address owner) view returns (uint256)",
          "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
        ],
        this.signer
      );
      const balance = await nftContract.balanceOf(address);
      const nfts = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
        nfts.push(tokenId.toString());
      }
      this.setState({ nfts, loadingNFTs: false });
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      this.setState({ errorNFTs: error, loadingNFTs: false });
    }
  }

  async registerCourse(courseId) {
    try {
      const course = this.state.courses.find((course) => course.id === courseId);
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
      console.log("receipt: ", receipt);
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
      console.log("Sending registration info to backend:", registrationInfo);

      // Send registration info to backend
      await axios.post("http://localhost:3001/api/addRegistration", registrationInfo);

      // Update state and fetch courses again
      this.setState({ successMessage: "Đăng ký thành công!" });
      await this.getCourses();
    } catch (error) {
      console.error("Error registering course:", error);
      this.setState({ errorCourses: error, loadingCourses: false });
    } finally {
      this.setState({ processingTransaction: false });
    }
  }

  handleTabChange(tab) {
    this.setState({ selectedTab: tab });
  }

  render() {
    const { courses, loadingCourses, selectedCourseId, processingTransaction, errorCourses, nfts, loadingNFTs, errorNFTs, selectedTab } = this.state;

    let content;
    if (loadingCourses || loadingNFTs) {
      content = <p>Loading...</p>;
    } else if (errorCourses || errorNFTs) {
      content = <p>Something went wrong. Please try again later.</p>;
    } else {
      switch (selectedTab) {
        case "course":
          content = (
            <ViewCardCourse
              courses={courses}
              error={errorCourses}
              onRegister={this.registerCourse.bind(this)}
              tokenContract={this.tokenContract}
              ownerAddress={ownerAddress}
              processingTransaction={processingTransaction}
              selectedCourseId={selectedCourseId}
              sendDataToBackend={(courseId, email, address) =>
                this.sendDataToBackend(courseId, email, address, selectedCourseId)
              }
            />
          );
          break;
        case "nft-market":
          content = (
            <Container>
              <Row>
                {nfts.length > 0 ? (
                  nfts.map((tokenId, index) => (
                    <Col md={3} key={index} className="mb-4">
                      <NFTDisplay contractAddress={NFT_address.Hero} tokenId={tokenId} provider={this.provider} />
                    </Col>
                  ))
                ) : (
                  <div>No NFTs found.</div>
                )}
              </Row>
            </Container>
          );
          break;
        default:
          content = null;
      }
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

          <div className="tab-container">
            <nav>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <Link
                    to="/course"
                    className={`nav-link ${selectedTab === "course" ? "active" : ""}`}
                    onClick={() => this.handleTabChange("course")}
                  >
                    Course
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/nft-market"
                    className={`nav-link ${selectedTab === "nft-market" ? "active" : ""}`}
                    onClick={() => this.handleTabChange("nft-market")}
                  >
                    NFT Market
                  </Link>
                </li>
              </ul>
            </nav>

            <Switch>
              <Route exact path="/course">
                {content}
              </Route>
              <Route path="/nft-market">{content}</Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
