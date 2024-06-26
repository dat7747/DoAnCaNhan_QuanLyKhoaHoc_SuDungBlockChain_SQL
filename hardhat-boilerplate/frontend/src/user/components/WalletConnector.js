import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { NoWalletDetected } from "../../components/NoWalletDetected";
import { ConnectWallet } from "../../components/ConnectWallet";
import { toast } from "react-toastify";
import { FaBell, FaCheckCircle } from 'react-icons/fa';
import NotificationList from "../../admin/components/NotificationList";
import axios from 'axios';

export function WalletConnector({ onLogin }) {
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);
  const [showNotificationBell, setShowNotificationBell] = useState(false);
  const [showNotificationTick, setShowNotificationTick] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const connectWallet = async () => {
    try {
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setSelectedAddress(address);
      onLogin(address); // Gọi hàm onLogin với địa chỉ ví sau khi kết nối thành công
      setShowNotificationBell(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setNetworkError(error.message);
    }
  };

  useEffect(() => {
    if (selectedAddress) {
      fetchNotifications();
    }
  }, [selectedAddress]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getNotifications', {
        params: { address: selectedAddress }
      });
      const notifications = response.data;
      setNotifications(notifications);
      console.log('Address sent to backend:', selectedAddress);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNewNotification = () => {
    setShowNotificationTick(true);
    setNotifications([...notifications, "New notification"]);
  };

  return (
    <div className="container p-4">
      {window.ethereum === undefined ? (
        <NoWalletDetected />
      ) : (
        <>
          {!selectedAddress ? (
            <ConnectWallet
              connectWallet={connectWallet}
              networkError={networkError}
              dismiss={() => setNetworkError(undefined)}
            />
          ) : (
            <p>
              Welcome <b>{selectedAddress}</b>
              {showNotificationBell && <FaBell style={{ color: 'yellow', fontSize: '24px' }} onClick={handleNewNotification} />}
              {showNotificationTick && <FaCheckCircle style={{ color: 'red', fontSize: '24px' }} />}
            </p>
          )}
          <NotificationList notifications={notifications} selectedAddress={selectedAddress} />
        </>
      )}
    </div>
  );
}
