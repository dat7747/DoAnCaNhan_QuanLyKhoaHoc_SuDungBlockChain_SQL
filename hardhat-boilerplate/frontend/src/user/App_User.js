import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import CourseRegistrationArtifact from "../contracts/CourseRegistration.json";
import contractAddress from "../contracts/contract-Course-address.json";
import TokenArtifact from "../contracts/Token.json";
import tokenContractAddress from "../contracts/contract-Token-address.json";
import ownerAddress from "../contracts/owner-address.json";
import { NoWalletDetected } from "../components/NoWalletDetected";
import { Loading } from "../components/Loading";
import { ViewCardCourse } from "./components/ViewCardCourse";
import NFTDisplay from "./components/NFTDisplay";
import NFT_address from "../contracts/contract-Hero-address.json";
import { WalletConnector } from "./components/WalletConnector";

// Import Marketplace component
import Marketplace from "./components/Marketplace";

export class App_User extends React.Component {
  constructor(props) {
    super(props);

    // Define initial state
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

    // Set up Ethereum provider and signer
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      this.provider = new ethers.providers.JsonRpcProvider();
    }
    this.signer = this.provider.getSigner();

    // Initialize contract instances
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

  // Fetch courses and NFTs when component mounts
  async componentDidMount() {
    this.getCourses();
    this.fetchNFTs();
  }

  // Function to send course registration data to backend
  async sendDataToBackend(courseId, gmail, address, selectedCourseId) {
    try {
      const response = await axios.post("http://localhost:3001/api/addData", {
        id: courseId,
        gmail,
        address
      });
      console.log("Data added successfully:", response.data);
    } catch (error) {
      console.error("Failed to add data:", error);
    }
  }

  // Function to fetch courses from backend
  async getCourses() {
    try {
      const response = await axios.get("http://localhost:3001/api/getCourses");
      const courses = response.data;
      this.setState({ courses, loadingCourses: false });
    } catch (error) {
      console.error("Error getting courses from backend:", error);
      this.setState({ errorCourses: error, loadingCourses: false });
    }
  }

  // Function to fetch user's NFTs
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

  // Function to handle course registration
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

      const receipt = await this.courseRegistrationContract.register(courseId);
      await receipt.wait();
      const transactionHash = receipt.hash;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const transactionReceipt = await provider.getTransactionReceipt(transactionHash);

      if (!transactionReceipt) {
        throw new Error("Transaction receipt is null");
      }

      this.setState({ selectedCourseId: courseId });

      const registrationInfo = {
        courseId: courseId,
        senderAddress: signerAddress,
        transactionHash: transactionReceipt.transactionHash
      };

      await axios.post("http://localhost:3001/api/addRegistration", registrationInfo);

      this.setState({ successMessage: "Đăng ký thành công!" });
      await this.getCourses();
    } catch (error) {
      console.error("Error registering course:", error);
      this.setState({ errorCourses: error, loadingCourses: false });
    } finally {
      this.setState({ processingTransaction: false });
    }
  }

  // Handle tab change
  handleTabChange(tab) {
    this.setState({ selectedTab: tab });
  }

  // Render method
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
        case "nft-of-you":
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
        case "nft-marketplace":
          content = <Marketplace provider={this.provider} />;
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
                    to="/nft-of-you"
                    className={`nav-link ${selectedTab === "nft-of-you" ? "active" : ""}`}
                    onClick={() => this.handleTabChange("nft-of-you")}
                  >
                    NFT OF YOU
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/nft-marketplace"
                    className={`nav-link ${selectedTab === "nft-marketplace" ? "active" : ""}`}
                    onClick={() => this.handleTabChange("nft-marketplace")}
                  >
                    NFT MARKETPLACE
                  </Link>
                </li>
              </ul>
            </nav>

            <Switch>
              <Route exact path="/course">
                {content}
              </Route>
              <Route path="/nft-of-you">{content}</Route>
              <Route path="/nft-marketplace">{content}</Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
