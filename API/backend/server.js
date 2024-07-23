const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataController = require('./controllers/dataController');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.post('/api/addData', dataController.addData);
app.post('/api/addCourse', upload.single('image'), dataController.addCourse);
app.put('/api/editCourse', upload.single('image'), dataController.editCourse);
app.get('/api/getAddress', dataController.getAddress);
app.post('/api/saveNotification', dataController.saveNotification);
app.get('/api/getNotifications', dataController.getNotifications);
app.post('/api/addUserAttendance', dataController.addUserAttendance);
app.post('/api/addRegistration', dataController.addRegistration);
app.get('/api/getCourses', dataController.getCourses);
app.post('/api/logTokenWithdrawal', dataController.logTokenWithdrawal);
app.put('/api/updateTransactionStatus', dataController.updateTransactionStatus);

// Thêm route mới
app.get('/api/getClassDetails', dataController.getClassDetails);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
