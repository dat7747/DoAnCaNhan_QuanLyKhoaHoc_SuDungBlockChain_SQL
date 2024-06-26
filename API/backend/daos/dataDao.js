// dataDao.js
const sql = require('mssql/msnodesqlv8');
const config = {
    server: 'DESKTOP-BSIJE74\\SQLEXPRESS',
    database: 'blockchain',
    user: 'sa',
    password: '123',
    options: {
        trustedConnection: true,
    },
    driver: 'msnodesqlv8',
};

async function addData(id, gmail, address) {
    try {
        console.log("Adding data to SQL:",id,  gmail, address); 
        await sql.connect(config);
        const request = new sql.Request();
        const query = `INSERT INTO info (id, gmail, address) VALUES (${id}, '${gmail}', '${address}')`;
        const result = await request.query(query);
        return result;
    } catch (error) {
        throw error;
    }
}

async function addCourse(id, price, sessions, status, image) {
    try {
        console.log("Adding data to SQL:", id, price, sessions, status, image);

        await sql.connect(config);
        const request = new sql.Request();
        const query = `INSERT INTO course (id, price, session, status, image) VALUES (${id}, ${price}, ${sessions}, '${status}', '${image}')`;
        const result = await request.query(query);

        return result;
    } catch (error) {
        console.error('Error adding data to SQL:', error);
        throw error;
    }
}

async function getAddress(id) {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT address FROM info WHERE id = ${id}`;
        return result.recordset.map(record => record.address);
    } catch (error) {
        throw error;
    }
}

async function saveNotification(id, notification, zoom_link, session_number) {
  try {
      await sql.connect(config);
      const request = new sql.Request();
      const query = `INSERT INTO notifications (id, notification, zoom_link, session_number) VALUES (${id}, '${notification}', '${zoom_link}', ${session_number})`;
      const result = await request.query(query);
      return result;
  } catch (error) {
      throw error;
  }
}

async function getNotifications(address) {
    try {
      await sql.connect(config);
      const request = new sql.Request();
      const query = `
        SELECT n.notification, n.zoom_link, n.session_number, n.created_at, n.id AS courseId
        FROM notifications n
        JOIN info i ON n.id = i.id
        WHERE i.address = '${address}'
        ORDER BY n.created_at DESC
      `;
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error fetching notifications from the database:', error);
      throw error;
    } finally {
      sql.close();
    }
  }

const addUserAttendance = async (courseId, address, sessionNumber, attended) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `INSERT INTO UserAttendance (courseId, address, sessionNumber, attended) VALUES (${courseId}, '${address}', ${sessionNumber}, ${attended})`;
        const result = await request.query(query);
        return result;
    } catch (error) {
        throw error;
    }
};

async function addRegistration(courseId, senderAddress, transactionHash) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            INSERT INTO CourseRegistrationHistory (courseId, senderAddress, transactionHash, registrationTime)
            VALUES (@courseId, @senderAddress, @transactionHash, GETDATE())
        `;
        request.input('courseId', sql.Int, courseId);
        request.input('senderAddress', sql.VarChar(100), senderAddress);
        request.input('transactionHash', sql.VarChar(255), transactionHash);
        const result = await request.query(query);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getCourses() {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = 'SELECT * FROM course';
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        throw error;
    }
}

async function editCourse(id, price, sessions, status, image) {
    try {
        console.log("Editing course in SQL:", id, price, sessions, status, image);
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            UPDATE course 
            SET price = ${price}, session = ${sessions}, status = '${status}', image = '${image}' 
            WHERE id = ${id}`;
        const result = await request.query(query);
        return result;
    } catch (error) {
        throw error;
    }
}

// Ghi nhận lại thông tin giao dịch rút token
async function logTokenWithdrawal(sender, recipient, amount, transactionHash, status) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `INSERT INTO TokenWithdrawals (sender_address, recipient_address, amount, transaction_hash, status)
                       VALUES ('${sender}', '${recipient}', ${amount}, '${transactionHash}', '${status}')`;
        const result = await request.query(query);
        return result;
    } catch (error) {
        throw error;
    }
}

// Cập nhật trạng thái giao dịch rút token
async function updateTransactionStatus(transactionHash, status) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `UPDATE TokenWithdrawals SET status = '${status}', updated_at = GETDATE() WHERE transaction_hash = '${transactionHash}'`;
        const result = await request.query(query);
        return result;
    } catch (error) {
        throw error;
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
updateTransactionStatus };

