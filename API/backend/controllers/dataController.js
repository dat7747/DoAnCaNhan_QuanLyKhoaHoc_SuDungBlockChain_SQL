// dataController.js
const dataService = require('../services/dataService');

async function addData(req, res) {
    const { id, gmail, address } = req.body;
    try {
        const result = await dataService.addData(id, gmail, address);
        console.log("id      :" + id);
        console.log("gmail   :" + gmail);
        console.log("adress  :" + address)
        res.status(200).json({ message: 'Data added successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add data' });
    }
}

async function addCourse(req, res) {
    try {
        const { id, price, sessions, status } = req.body;
        const image = req.file ? req.file.filename : null; // Get filename if file exists

        console.log("Received data from client:");
        console.log("ID:", id);
        console.log("Price:", price);
        console.log("Sessions:", sessions);
        console.log("Status:", status);
        console.log("Image:", image);

        // Perform any necessary validations or processing

        const result = await dataService.addCourse(id, price, sessions, status, image);
        res.status(200).json({ message: 'Course added successfully', data: result });
    } catch (error) {
        console.error('Error adding course in controller:', error);
        res.status(500).json({ message: 'Failed to add course', error });
    }
}


async function getAddress(req, res) {
    const {id} = req.query;
    try {
        console.log("id      :" + id);
        const address = await dataService.getAddress(id);
        res.status(200).json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Failed to fetch address' });
    }
}

async function saveNotification (req, res){

    try {
        const { id, notification, zoom_link, session_number } = req.body;
        await dataService.saveNotification(id, notification, zoom_link, session_number);
        console.log(id);
        console.log(notification);
        console.log(zoom_link);
        console.log(session_number);

        res.status(200).send('Notification saved successfully');
      } catch (error) {
        console.error('Error saving notification:', error);
        res.status(500).send('Error saving notification');
      }
}


const getNotifications = async (req, res) => {
    try {
      const { address } = req.query;
      const notifications = await dataService.getNotifications(address);
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  };
  

const addUserAttendance = async (req, res) => {
    try {
        const { courseId, address, sessionNumber, attended } = req.body;
        const result = await dataService.addUserAttendance(courseId, address, sessionNumber, attended);
        console.log(courseId);
        console.log(address);
        console.log(sessionNumber);
        console.log(attended);
        res.status(200).json({ message: 'Attendance added successfully', result });
    } catch (error) {
        console.error('Error in addUserAttendance controller:', error);
        res.status(500).json({ message: 'Error adding attendance', error });
    }
};

async function getCourses(req, res) {
    try {
        const courses = await dataService.getCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses in controller:', error);
        res.status(500).json({ message: 'Failed to fetch courses', error });
    }
}

async function addRegistration(req, res) {
    try {
        const { courseId, senderAddress, transactionHash } = req.body;
        
        // Log các giá trị nhận được từ request body
        console.log('Received addRegistration request with data:');
        console.log(`courseId: ${courseId}`);
        console.log(`senderAddress: ${senderAddress}`);
        console.log(`transactionHash: ${transactionHash}`);
        
        const result = await dataService.addRegistration(courseId, senderAddress, transactionHash);
        res.status(200).json({ message: 'Registration added successfully', data: result });
    } catch (error) {
        console.error('Error adding registration in controller:', error);
        res.status(500).json({ message: 'Failed to add registration', error });
    }
}


async function editCourse(req, res) {
    try {
        const { id, price, sessions, status } = req.body;
        const image = req.file ? req.file.filename : req.body.oldImage; // Lấy filename nếu file tồn tại, ngược lại lấy ảnh cũ

        console.log("Received data from client for editing course:");
        console.log("ID:", id);
        console.log("Price:", price);
        console.log("Sessions:", sessions);
        console.log("Status:", status);
        console.log("Image:", image);

        // Perform any necessary validations or processing

        const result = await dataService.editCourse(id, price, sessions, status, image);
        res.status(200).json({ message: 'Course edited successfully', data: result });
    } catch (error) {
        console.error('Error editing course in controller:', error);
        res.status(500).json({ message: 'Failed to edit course', error });
    }
}

async function logTokenWithdrawal(req, res) {
    const { sender, recipient, amount, transactionHash, status } = req.body;
    try {
        const result = await dataService.logTokenWithdrawal(sender, recipient, amount, transactionHash, status);
        res.status(200).json({ message: 'Token withdrawal logged successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to log token withdrawal' });
    }
}

async function updateTransactionStatus(req, res) {
    const { transactionHash, status } = req.body;
    try {
        const result = await dataService.updateTransactionStatus(transactionHash, status);
        res.status(200).json({ message: 'Transaction status updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update transaction status' });
    }
}


module.exports = { 
addData, 
addCourse, 
getAddress, 
saveNotification, 
getNotifications,
addUserAttendance,
addRegistration,
getCourses, 
editCourse,
logTokenWithdrawal,
updateTransactionStatus};