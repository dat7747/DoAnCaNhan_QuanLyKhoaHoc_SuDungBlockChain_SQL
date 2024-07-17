import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { NoWalletDetected } from "../../components/NoWalletDetected";
import { ConnectWallet } from "../../components/ConnectWallet";
import { toast } from "react-toastify";
import { FaBell, FaCheckCircle } from 'react-icons/fa';
import NotificationList from "../../admin/components/NotificationList";
import axios from 'axios';
import { Container, Alert, Row, Col } from 'react-bootstrap';
import '../../css/WalletConnector.css';

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
      onLogin(address);
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
      setNotifications(response.data);
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
    <Container className="wallet-connector p-4">
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
            <Alert variant="success">
              <Row className="align-items-center">
                <Col md="auto">
                  <h5>Welcome <b>{selectedAddress}</b></h5>
                </Col>
                <Col>
                  {showNotificationBell && (
                    <FaBell
                      className="notification-icon"
                      onClick={handleNewNotification}
                    />
                  )}
                  {showNotificationTick && (
                    <FaCheckCircle className="notification-icon" />
                  )}
                </Col>
              </Row>
            </Alert>
          )}
          <NotificationList notifications={notifications} selectedAddress={selectedAddress} />
        </>
      )}
    </Container>
  );
}
