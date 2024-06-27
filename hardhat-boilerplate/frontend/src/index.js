import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./admin/App";
import { App_User } from "./user/App_User";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Main = () => {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (address) => {
    const adminAddress = "0x79deeb02f604e9f801ff4a1e27f3ce470eeb8d1d";
    console.log("Logged in address:", address); // Log địa chỉ đã đăng nhập
    if (address === adminAddress) {
      console.log("Admin logged in"); // Log nếu đăng nhập là admin
      setUserRole("admin");
    } else {
      console.log("User logged in"); // Log nếu đăng nhập là user
      setUserRole("user");
    }
    console.log("UserRole trong handleLogin:", userRole); // Log trạng thái userRole hiện tại
  };

  console.log("UserRole trước khi return:", userRole); // Log trạng thái userRole hiện tại

  return (
    <React.StrictMode>
      <div style={{ backgroundColor: "#87CEEB", minHeight: "100vh" }}>
        {userRole === "admin" ? (
          <App />
        ) : (
          <App_User onLogin={handleLogin} />
        )}
      </div>
    </React.StrictMode>
  );
};

root.render(<Main />);
