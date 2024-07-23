import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from "ethers";
import CourseRegistrationArtifact from "../../contracts/CourseRegistration.json";
import contractAddress from "../../contracts/contract-Course-address.json";
import { toast } from "react-toastify";
import { Card, Button, Container } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import '../../css/WalletConnector.css';

const NotificationList = ({ notifications, selectedAddress }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 1);

  const handleZoomLinkClick = async (event, notification) => {
    event.preventDefault();
    console.log(notification);
    try {
      const { courseId, session_number, zoom_link, class_name } = notification;
      console.log('courseId:', courseId);
      console.log('sessionNumber:', session_number);
      console.log('zoom_link:', zoom_link);
      console.log('class_name:', class_name);
      console.log('selectedAddress:', selectedAddress);
      if (!courseId || !session_number) {
        throw new Error("Invalid courseId or sessionNumber");
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress.CourseRegistration, 
        CourseRegistrationArtifact.abi, 
        signer
      );
      await contract.markAttendanceByLink(courseId, session_number);
      const response = await axios.post('http://localhost:3001/api/addUserAttendance', {
        courseId,
        address: selectedAddress,
        sessionNumber: session_number,
        attended: 1
      });
      console.log('API response:', response.data);
      toast.success("Attendance recorded successfully!");
      window.open(zoom_link, "_blank");
    } catch (error) {
      console.error('Error marking attendance and saving to DB:', error);
      toast.error("Failed to record attendance.");
    }
  };

  return (
    <Container className="notification-list">
      {displayedNotifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        <div>
          {displayedNotifications.map((notification, index) => (
            <Card className="notification-card" key={index}>
              <Card.Body>
                <div className="notification-header">
                  <Card.Title>{new Date(notification.created_at).toLocaleString()}</Card.Title>
                  <FaBell className="notification-icon" />
                </div>
                <Card.Text className="notification-content">
                  <strong>Tên lớp học:</strong> {notification.className}
                  <br />
                  <strong>Thông báo:</strong> {notification.notification}
                  <br />
                  <strong>Link Zoom:</strong> 
                  <a href={notification.zoom_link} onClick={(event) => handleZoomLinkClick(event, notification)}>
                    {notification.zoom_link}
                  </a>
                  <br />
                  <strong>Số buổi:</strong> {notification.session_number}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
          {notifications.length > 1 && (
            <Button className="show-more-btn" onClick={toggleShowAll}>
              {showAll ? 'Thu gọn' : 'Xem thêm'}
            </Button>
          )}
        </div>
      )}
    </Container>
  );
};

export default NotificationList;
