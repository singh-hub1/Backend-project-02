// const { decryptData, encryptData } = require("./utility");
var express = require("express");
const cors = require("cors");
var mysql = require("mysql");
var app = express();
const { Client } = require("pg");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
// app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// app.get("/", function (req, res) {
//   res.send("Hey there");
// });


// Allow requests from localhost:3000
// app.use(cors({
//   origin: 'frontend-project-02.vercel.app',
//   credentials: true
// }));

app.use(cors());


// Enable CORS middleware
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend-project-02.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
      res.sendStatus(200); // Preflight request response
  } else {
      next();
  }
});









const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { addListener } = require("nodemon");
const { application, response } = require("express");
// const { sendEMail } = require("./demo");

// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   port: "3306",
//   user: "root",
//   password: "Biltz123@",
//   database: "biltz-data",
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("success");
// });

// const con = new Client({
//   user: "postgres",
//   password: "Vishalsingh@2024",
//   database: "postgres",
//   port: 5432,
//   host: "db.syiryyyqefdfopqaggcx.supabase.co",
//   ssl: { rejectUnauthorized: false },
// });


const connection = new Client({
    user: "postgres.syiryyyqefdfopqaggcx",
    password: "Vishalsingh@2024",
    database: "postgres",
    port: 5432,
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    ssl: { rejectUnauthorized: false },
  });
  



connection.connect()
  .then(() => {
    console.log("Connected!!!");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });


  //F-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Endpoint for user login
app.post('/userlogin', (req, res) => {
    const { name, password } = req.body;
    connection.query('select * from userdata where username = $1 and password = $2', [name, password], (error, results) => {
      if (error) {
        console.error('Error executing login query:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
      }
  
      if (results.rows.length === 1) {
        
        // console.log( results.rows[0]);
        res.json({ success: true, user: results.rows[0] });
      } else {
        // Login failed
        res.status(401).json({ success: false, error: 'Incorrect username or password' });
      }
    });
  });
  //
  













  
  
  
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------


// Route to handle PUT request to update user data
// app.put('/users/:userId', (req, res) => {
//   const userId = req.params.userId;
//   const updatedUserData = req.body;
// // console.log(userId);
// // console.log(updatedUserData);
//   // Update user data in the database
//   const query = 'update userdata set $1 where id = $2';
//   connection.query(query, [updatedUserData, userId], (err, result) => {
//     if (err) {
//       console.error('Error updating user data:', err);
//       res.status(500).json({ error: 'Error updating user data' });
//     } else {
//       console.log('User data updated successfully');
//       res.status(200).json({ message: 'User data updated successfully' });
//     }
//   });
// });


// Update user information route
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  // console.log(userId);
  const { name, username, department, designation, dateofjoining } = req.body;
// console.log(req.body);
  try {
    // Update user information in the database
    const result = await connection.query(
  'update userdata set name = $1, username = $2, department = $3, designation = $4, dateofjoining = $5 where id = $6',
      [name, username, department, designation, dateofjoining, userId]
    );

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to handle reset password request
app.post('/resetpassword', (req, res) => {
  const { username,newpassword } = req.body;

  // Find user by username
  const query = 'select username from userdata where username=$1';
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const user = results[0];

    // Update user's password
    const updateQuery = 'update userdata set password = $1,confirmpassword= $2  where username = $3';
    connection.query(updateQuery, [newpassword,newpassword, username], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating password:', updateError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Password reset successfully' });
    });
  });
});




 // Endpoint for admin login

app.post('/adminlogin', (req, res) => {
  const { name, password } = req.body;
  // console.log(req.body);
  connection.query('select * from admin where username = $1 and password = $2', [name, password], (error, results) => {
    if (error) {
      res.status(500).send('Error in database query');
    } else {
      if (results.rows.length > 0) {
        // console.log( results.rows[0]);
        res.status(200).json({ success: true }); // Send success response
      } else {
        // console.log('Invalid username or password');
        res.status(401).json({ success: false, message: 'Invalid username or password' }); // Send failure response
      }
    }
  });
});


  // Endpoint to fetch user profiles
app.get('/userProfiles', (req, res) => {
  // Fetch user profiles from database
  const sql = 'select * from userdata;';
  // console.log(sql);
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'An error occurred while fetching user profiles' });
    } else {
      // console.log(result.rows[0]);
      res.json(result.rows);
    }
  });
});

//--------------------------------------------------------------------------------------------------------------------------------------------

// Endpoint for newdata

app.post('/newuserdata', (req, res) => {
  const { username, password, confirmpassword, name, dateofjoining, designation, department} = req.body;
    const sql = 'insert into userdata (username, password,confirmpassword, name, dateofjoining, designation, department) VALUES ($1, $2, $3, $4, $5, $6,$7)';
  const values = [username, password,confirmpassword, name, dateofjoining, designation, department];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving employee details:', err);
      res.status(500).json({ error: 'Error saving employee details' });
      return;
    }
    console.log('Employee details saved successfully');
    res.status(200).json({ message: 'Employee details saved successfully' });
  });
});





//------------------------------------------------------------------------------------------------------------------------------------------------
// API endpoints
// app.get('/userProfiles', (req, res) => {
//   const sql = 'select * from userdata;';
//   connection.query(sql, (err, result) => {
//     if (err) {
//       console.error('Error fetching user profiles:', err);
//       res.status(500).json({ error: 'Error fetching user profiles' });
//       return;
//     }
//     res.json(result.rows[0]);
//   });
// });


//-----------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/userProfiles/:id', (req, res) => {
  const { id } = req.params;
  const { name, dateofjoining, designation, department } = req.body;
  const sql = 'update userdata set name=$1, dateofjoining=$2, designation=$3, department=$4 where id=$5';
  connection.query(sql, [name, dateofjoining, designation, department, id], (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      res.status(500).json({ error: 'Error updating user profile' });
      return;
    }
    res.json({ message: 'User profile updated successfully' });
  });
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete('/userProfiles/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'delete from userdata where id=$1';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user profile:', err);
      res.status(500).json({ error: 'Error deleting user profile' });
      return;
    }
    res.json({ message: 'User profile deleted successfully' });
  });
});

// Route to fetch admin profile
// Route to fetch admin profile
app.get('/admin/profile', (req, res) => {
  const username = req.query.username;
  // console.log(username);
  const query = 'select username from admin where username = $1';

  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching admin profile from MySQL:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('Admin not found for username:', username);
      return res.status(404).json({ error: 'Admin not found' });
    }

    const adminName = results.rows.name;
    return res.json({ name: adminName });
  });
});

//************************************************************************************************************************************************************* */
// Create a leave application
app.post('/leave-applications', (req, res) => {
  const { name, leaveType, empCode, startDate, endDate, daysOfLeave, reason } = req.body;
  const insertQuery = `insert into leave_application (name, leavetype, empcode, startdate, enddate, daysofleave, reason) values ($1, $2, $3, $4, $5, $6, $7)`;
  connection.query(insertQuery, [name, leaveType, empCode, startDate, endDate, daysOfLeave, reason], (err, result) => {
    if (err) {
      console.error('Error creating leave application:', err);
      res.status(500).send('Error creating leave application');
    } else {
      console.log('Leave application created successfully');
      res.status(200).send('Leave application created successfully');
    }
  });
});



// // API endpoints
app.get('/leaveapplications', (req, res) => {
  const sql = 'select name,leavetype,empcode,startdate,enddate,daysofleave,status from leave_application';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'Error fetching user profiles' });
      return;
    }
    // console.log(result);
    res.json(result.rows);
  });
});


// PUT request to update leave application status
app.put('/leaveapplications/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
// console.log(id);
// console.log(status);
  const sql = `update leave_application set status = $1 where empcode = $2`;

  connection.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      res.status(500).send('Error updating status');
    } else {
      console.log('Status updated successfully');
      res.status(200).send('Status updated successfully');
    }
  });
});




