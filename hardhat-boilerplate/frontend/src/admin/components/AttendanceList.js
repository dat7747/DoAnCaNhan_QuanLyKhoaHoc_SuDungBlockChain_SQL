import React, { useState } from "react";
import { ethers } from "ethers";
import CourseRegistrationArtifact from "../../contracts/CourseRegistration.json";
import contractAddress from "../../contracts/contract-Course-address.json";
import "../../AttendanceList.css"; // Import file CSS

export function AttendanceList() {
  const [courseId, setCourseId] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress.CourseRegistration,
    CourseRegistrationArtifact.abi,
    signer
  );

  async function fetchAttendanceData(courseId) {
    try {
      console.log("Fetching attendance data for course:", courseId);

      // Gọi hàm getAttendanceStatus từ smart contract
      const [users, attendance] = await contract.getAttendanceStatus(courseId);

      console.log("Users:", users);
      console.log("Attendance:", attendance);

      // Xử lý dữ liệu để phù hợp với định dạng mong muốn
      const attendanceList = users.map((user, index) => ({
        user: user.slice(0, 10) + "..." + user.slice(-4), // Chỉ lấy một phần của địa chỉ và thêm dấu "..." giữa
        attendance: attendance[index],
      }));

      setAttendanceData(attendanceList);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAttendanceData(courseId);
  };

  return (
    <div className="attendance-list">
      <h2 className="text-center">Attendance</h2>
      <form onSubmit={handleSubmit} className="attendance-form">
        <label>
          Course ID:
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="course-id-input"
          />
        </label>
        <button type="submit" className="fetch-button">
          Lấy trạng thái điểm danh
        </button>
      </form>
      {error && <div className="error">{error.message}</div>}
      {attendanceData.length > 0 && (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>User Address</th>
              {attendanceData[0].attendance.map((_, sessionIndex) => (
                <th key={sessionIndex}>Session {sessionIndex + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((data, index) => (
              <tr key={index}>
                <td>{data.user}</td>
                {data.attendance.map((att, sessionIndex) => (
                  <td key={sessionIndex}>{att.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
