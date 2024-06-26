const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataController = require('./controllers/dataController');
const path = require('path');
const multer = require('multer'); // Thêm multer

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Cấu hình để phục vụ các tệp tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cấu hình multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Các endpoint API khác
app.post('/api/addData', dataController.addData);
app.post('/api/addCourse', upload.single('image'), dataController.addCourse); // Thêm upload middleware
app.put('/api/editCourse', upload.single('image'), dataController.editCourse);
app.get('/api/getAddress', dataController.getAddress);
app.post('/api/saveNotification', dataController.saveNotification);
app.get('/api/getNotifications', dataController.getNotifications);
app.post('/api/addUserAttendance', dataController.addUserAttendance);
app.post('/api/addRegistration', dataController.addRegistration);
app.get('/api/getCourses', dataController.getCourses);
app.post('/api/logTokenWithdrawal', dataController.logTokenWithdrawal);
app.put('/api/updateTransactionStatus', dataController.updateTransactionStatus);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
