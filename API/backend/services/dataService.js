// dataService.js

const dataDao = require('../daos/dataDao');
async function addData(id, gmail, address) {
    try {
        const result = await dataDao.addData(id, gmail, address);
        return result;
    } catch (error) {
        throw error;
    }
}

async function addCourse(id, price, sessions, status, image) {
  try {
      const result = await dataDao.addCourse(id, price, sessions, status, image);
      return result;
  } catch (error) {
      throw error;
  }
}

async function getAddress(id) {
    try {
        const address = await dataDao.getAddress(id);
        return address;
    } catch (error) {
        throw error;
    }
}

async function saveNotification(id, notification, zoom_link, session_number) {
    try {
      const result = await dataDao.saveNotification(id, notification, zoom_link, session_number);
      return result;
    } catch (error) {
      console.error('Error in saveNotification service:', error);
      throw error;
    }
  }


  async function getNotifications(address) {
    try {
      const notifications = await dataDao.getNotifications(address);
      return notifications;
    } catch (error) {
      console.error('Error in fetchNotifications service:', error);
      throw error;
    }
  }

  const addUserAttendance = async (courseId, address, sessionNumber, attended) => {
    try {
        const result = await dataDao.addUserAttendance(courseId, address, sessionNumber, attended);
        return result;
    } catch (error) {
        console.error('Error in addUserAttendance service:', error);
        throw error;
    }
};

async function addRegistration(courseId, senderAddress, transactionHash) {
  try {
      const result = await dataDao.addRegistration(courseId, senderAddress, transactionHash);
      return result;
  } catch (error) {
      console.error('Error adding registration in service:', error);
      throw error;
  }
}


async function getCourses() {
  try {
      const courses = await dataDao.getCourses();
      return courses;
  } catch (error) {
      throw error;
  }
}

async function editCourse(id, price, sessions, status, image) {
  try {
      const result = await dataDao.editCourse(id, price, sessions, status, image);
      return result;
  } catch (error) {
      throw error;
  }
}

async function logTokenWithdrawal(sender, recipient, amount, transactionHash, status) {
  try {
      const result = await dataDao.logTokenWithdrawal(sender, recipient, amount, transactionHash, status);
      return result;
  } catch (error) {
      throw error;
  }
}

// Cập nhật trạng thái giao dịch rút token
async function updateTransactionStatus(transactionHash, status) {
  try {
      const result = await dataDao.updateTransactionStatus(transactionHash, status);
      return result;
  } catch (error) {
      throw error;
  }
}

module.exports = { 
addData,
addCourse,
getAddress,
getNotifications,
saveNotification,
addUserAttendance,
addRegistration,
getCourses,
editCourse,
logTokenWithdrawal,
updateTransactionStatus};

