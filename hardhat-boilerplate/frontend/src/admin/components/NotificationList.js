import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from "ethers";
import CourseRegistrationArtifact from "../../contracts/CourseRegistration.json";
import contractAddress from "../../contracts/contract-Course-address.json";
import { toast } from "react-toastify";

const NotificationList = ({ notifications, selectedAddress }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 2);

  const handleZoomLinkClick = async (event, notification) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
  
    console.log(notification);
    try {
      const { courseId, session_number, zoom_link } = notification; // Sửa từ sessionNumber thành session_number
  
      // Log values to debug
      console.log('courseId:', courseId);
      console.log('sessionNumber:', session_number); // Sửa từ sessionNumber thành session_number
      console.log('zoom_link:', zoom_link);
      console.log('selectedAddress:', selectedAddress);
  
      // Validate courseId và sessionNumber
      if (!courseId || !session_number) { // Sửa từ sessionNumber thành session_number
        throw new Error("Invalid courseId or sessionNumber");
      }
  
      // Initialize Web3 và contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress.CourseRegistration, 
        CourseRegistrationArtifact.abi, 
        signer
      );
  
      // Gọi hàm smart contract để đánh dấu điểm danh
      await contract.markAttendanceByLink(courseId, session_number); // Sửa từ sessionNumber thành session_number
  
      // Gọi API để thêm điểm danh của người dùng
      const response = await axios.post('http://localhost:3001/api/addUserAttendance', {
        courseId,
        address: selectedAddress,
        sessionNumber: session_number, // Sửa từ sessionNumber thành session_number
        attended: 1
      });
  
      console.log('API response:', response.data);
  
      toast.success("Attendance recorded successfully!");
  
      // Chuyển hướng đến liên kết Zoom sau khi điểm danh được ghi nhận
      window.location.href = zoom_link;
    } catch (error) {
      console.error('Error marking attendance and saving to DB:', error);
      toast.error("Failed to record attendance.");
    }
  };
  
  return (
    <div>
      {displayedNotifications.length === 0 ? (
        <p>Connect seen Notification</p>
      ) : (
        <div>
          <ul>
            {displayedNotifications.map((notification, index) => (
              <li key={index}>
                <div>
                  <strong>Notification:</strong> {notification.notification}
                </div>
                <div>
                  <strong>Zoom Link:</strong> 
                  <a href={notification.zoom_link} onClick={(event) => handleZoomLinkClick(event, notification)}>
                    {notification.zoom_link}
                  </a>

                </div>
                <div>
                  <strong>Session Number:</strong> {notification.session_number}
                </div>
                <div>
                  <strong>Created At:</strong> {new Date(notification.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
          {notifications.length > 2 && (
            <button onClick={toggleShowAll}>{showAll ? '<< Thu gọn' : 'Xem thêm >>'}</button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
