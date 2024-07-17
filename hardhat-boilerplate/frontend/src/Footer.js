import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import '../src/css/style.css'; // Import file CSS cho footer

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white">
      <Container>
        <Row className="py-4">
          <Col md={4} className="text-center text-md-left">
            <h5>About Us</h5>
            <p>
              We are a company committed to providing the best services and products for our customers.
            </p>
          </Col>
          <Col md={4} className="text-center">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2"><FaLinkedinIn /></a>
            </div>
          </Col>
          <Col md={4} className="text-center text-md-right">
            <h5>Contact Us</h5>
            <p>
              Email: contact@company.com<br />
              Phone: +123 456 7890
            </p>
          </Col>
        </Row>
        <Row className="py-3 border-top border-secondary">
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
