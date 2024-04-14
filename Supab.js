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

// app.use(cors());


// // Enable CORS middleware
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'https://frontend-project-02.vercel.app');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   if (req.method === 'OPTIONS') {
//       res.sendStatus(200); // Preflight request response
//   } else {
//       next();
//   }
// });



// Enable CORS middleware
app.use(cors({
  origin: 'https://frontend-project-02.vercel.app', // Set the origin to allow requests from
  // origin:'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS','DELETE','PUT'], // Set allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Set allowed headers
  credentials: true // Allow credentials (cookies, authorization headers)
}));








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
  const { emp_code,username, password, confirmpassword, name, dateofjoining, designation, department} = req.body;
    const sql = 'insert into userdata (emp_code,username, password,confirmpassword, name, dateofjoining, designation, department) VALUES ($1, $2, $3, $4, $5, $6,$7,$8)';
  const values = [emp_code,username, password,confirmpassword, name, dateofjoining, designation, department];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving employee details:', err);
      res.status(500).json({ error: 'Error saving employee details' });
      return;
    }
    // console.log('Employee details saved successfully');
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

app.put('/userProfiles/:emp_code', (req, res) => {
  const { emp_code } = req.params;
  const { name, dateofjoining, designation, department } = req.body;
  const sql = 'update userdata set name=$1, dateofjoining=$2, designation=$3, department=$4 where emp_code=$5';
  connection.query(sql, [name, dateofjoining, designation, department, emp_code], (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      res.status(500).json({ error: 'Error updating user profile' });
      return;
    }
    res.json({ message: 'User profile updated successfully' });
  });
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete('/userProfiles/:emp_code', (req, res) => {
  const { emp_code } = req.params;
  const sql = 'delete from userdata where emp_code=$1';
  connection.query(sql, [emp_code], (err, result) => {
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
  const { name,empCode,leaveType, startDate, endDate, daysOfLeave, reason } = req.body;


// Get current UTC time
const utcTime = new Date();
  
// Calculate the offset for Indian Standard Time (IST) in milliseconds (UTC+5:30)
const istOffset = 5.5 * 60 * 60 * 1000;

// Calculate the current time in IST
const istTime = new Date(utcTime.getTime() + istOffset);

// Format IST time as a string in 'YYYY-MM-DD HH:MM:SS' format
const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');

  // Get current date in 'YYYY-MM-DD' format
  const currentDate = new Date().toISOString().slice(0, 10);


  const insertQuery = `insert into leave_application (name, leavetype, emp_code, applied_leave_dates,startdate, enddate, daysofleave, reason) values ($1, $2, $3, $4, $5, $6, $7,$8)`;
  connection.query(insertQuery, [name,leaveType, empCode,currentDate, startDate, endDate, daysOfLeave, reason], (err, result) => {
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
  const sql = 'select applied_leave_dates,name,leavetype,emp_code,startdate,enddate,daysofleave,status from leave_application';
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
app.put('/leaveapplications/:emp_code', (req, res) => {
  const { emp_code } = req.params;
  const { status } = req.body;
// console.log(emp_code);
// console.log(status);
  const sql = `update leave_application set status = $1 where emp_code = $2`;

  connection.query(sql, [status, emp_code], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      res.status(500).send('Error updating status');
    } else {
      console.log('Status updated successfully');
      res.status(200).send('Status updated successfully');
    }
  });
});




// Define a route to fetch leave data
app.get('/api/leave-data', (req, res) => {
  
  const status = "Pending";
  const sql ='select name,emp_code,status,applied_leave_dates from leave_application where status=$1';
  connection.query(sql, [status], (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'Error fetching user profiles' });
      return;
    }
    // console.log(result.rows);
    res.json(result.rows);
  });
});


// Define a route to fetch approved data
app.get('/api/approved-data', (req, res) => {
  
  const status = "Approved";
  const sql ='select name,emp_code,status,applied_leave_dates from leave_application where status=$1';
  connection.query(sql, [status], (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'Error fetching user profiles' });
      return;
    }
    // console.log(result.rows);
    res.json(result.rows);
  });
});





// Define a route to fetch Rejected data
app.get('/api/Rejected-data', (req, res) => {
  
  const status = "Rejected";
  const sql ='select name,emp_code,status,applied_leave_dates from leave_application where status=$1';
  connection.query(sql, [status], (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'Error fetching user profiles' });
      return;
    }
    // console.log(result.rows);
    res.json(result.rows);
  });
});


// Define a route to fetch Rejected data
app.get('/api/tracking-leaves', (req, res) => {
  
  
  const sql ='select name,daysofleave,emp_code,total_leaves from leave_application';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'Error fetching user profiles' });
      return;
    }
    // console.log(result.rows);
    res.json(result.rows);
  });
});




// API endpoint to fetch leave data for a particular user
app.get('/leavedetails/:employeeCode', (req, res) => {
  const empCode = req.params.employeeCode;
// console.log(empCode);
  const query = `select * from leave_application where emp_code = $1`;

  connection.query(query, [empCode], (err, results) => {
    if (err) {
      console.error('Error fetching leave data: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results.rows);
  });
});






// USERDASHBOARD TIMESHEET API********************************************************



// Route to handle time-in requests


app.post('/timein', (req, res) => {
  const { employeeCode, employeeUsername } = req.body;

 
  // console.log('Employee Code:', employeeCode);
  // console.log('Employee Username:', employeeUsername);
 

   // Get current UTC time
 const utcTime = new Date();
  
 // Calculate the offset for Indian Standard Time (IST) in milliseconds (UTC+5:30)
 const istOffset = 5.5 * 60 * 60 * 1000;
 
 // Calculate the current time in IST
 const istTime = new Date(utcTime.getTime() + istOffset);
 
 // Format IST time as a string in 'YYYY-MM-DD HH:MM:SS' format
 const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');

   // Get current date in 'YYYY-MM-DD' format
   const currentDate = new Date().toISOString().slice(0, 10);


 const sql = 'insert into user_time_sheet (username,emp_code,time_in,user_current_date) VALUES ($1, $2, $3,$4)';
 const values = [employeeUsername,employeeCode,istTimeString,currentDate];

 connection.query(sql, values, (err, result) => {
  if (err) {
    console.error('Error inserting data into MySQL: ' + err.message);
    res.status(500).json({ error: 'Error recording time in.' });
    return;
  }
  console.log('Time in recorded successfully.');
  res.status(200).json({ message: 'Time in recorded successfully.' });
});
});




// app.post('/timein', (req, res) => {
//   const { employeeCode, employeeUsername } = req.body;

//   // Get current UTC time
//   const utcTime = new Date();
  
//   // Calculate the offset for Indian Standard Time (IST) in milliseconds (UTC+5:30)
//   const istOffset = 5.5 * 60 * 60 * 1000;
 
//   // Calculate the current time in IST
//   const istTime = new Date(utcTime.getTime() + istOffset);
 
//   // Format IST time as a string in 'YYYY-MM-DD HH:MM:SS' format
//   const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');

//   // Get current date in 'YYYY-MM-DD' format
//   const currentDate = new Date().toISOString().slice(0, 10);

//   // Check if there is already a time-in record for the current date
//   const selectSql = 'select * from user_time_sheet where emp_code = $1 AND user_current_date = $2';
//   const selectValues = [employeeCode, currentDate];

//   connection.query(selectSql, selectValues, (selectErr, selectResult) => {
//     if (selectErr) {
//       console.error('Error selecting data from MySQL: ' + selectErr.message);
//       res.status(500).json({ error: 'Error updating time in.' });
//       return;
//     }
    
//     if (selectResult.length === 0) {
//       // If no record exists for the current date, insert a new record
//       const insertSql = 'INSERT INTO user_time_sheet (username, emp_code, time_in, user_current_date) VALUES ($1, $2, $3, $4)';
//       const insertValues = [employeeUsername, employeeCode, istTimeString, currentDate];

//       connection.query(insertSql, insertValues, (insertErr, insertResult) => {
//         if (insertErr) {
//           console.error('Error inserting data into MySQL: ' + insertErr.message);
//           res.status(500).json({ error: 'Error recording time in.' });
//           return;
//         }
//         console.log('Time in recorded successfully.');
//         res.status(200).json({ message: 'Time in recorded successfully.' });
//       });
//     } else {
//       // If a record already exists for the current date, update the time_in column
//       const updateSql = 'UPDATE user_time_sheet SET time_in = $1 WHERE username = $2 AND user_current_date = $3';
//       const updateValues = [istTimeString, employeeUsername, currentDate];

//       connection.query(updateSql, updateValues, (updateErr, updateResult) => {
//         if (updateErr) {
//           console.error('Error updating data in MySQL: ' + updateErr.message);
//           res.status(500).json({ error: 'Error updating time in.' });
//           return;
//         }
//         console.log('Time in updated successfully.');
//         res.status(200).json({ message: 'Time in updated successfully.' });
//       });
//     }
//   });
// });










// Route to handle time-out requests
app.post('/timeout', (req, res) => {
  const { employeeCode, employeeUsername } = req.body;

 
  // console.log('Employee Code:', employeeCode);
  // console.log('Employee Username:', employeeUsername);
 

   // Get current UTC time
 const utcTime = new Date();
  
 // Calculate the offset for Indian Standard Time (IST) in milliseconds (UTC+5:30)
 const istOffset = 5.5 * 60 * 60 * 1000;
 
 // Calculate the current time in IST
 const istTime = new Date(utcTime.getTime() + istOffset);
 
 // Format IST time as a string in 'YYYY-MM-DD HH:MM:SS' format
 const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');

 const sql = 'update user_time_sheet  set time_out = $1  where username = $2 and emp_code = $3';
 const values = [istTimeString,employeeUsername,employeeCode,];

 connection.query(sql, values, (err, result) => {
  if (err) {
    console.error('Error updating data into MySQL: ' + err.message);
    res.status(500).json({ error: 'Error recording time out.' });
    return;
  }
  console.log('Time out recorded successfully.');
  res.status(200).json({ message: 'Time out recorded successfully.' });
});
});






// Route to handle tea break requests
app.post('/teabreak', (req, res) => {
  const { employeeCode, employeeUsername } = req.body;

 
  // console.log('Employee Code:', employeeCode);
  // console.log('Employee Username:', employeeUsername);
 

   // Get current UTC time
 const utcTime = new Date();
  
 // Calculate the offset for Indian Standard Time (IST) in milliseconds (UTC+5:30)
 const istOffset = 5.5 * 60 * 60 * 1000;
 
 // Calculate the current time in IST
 const istTime = new Date(utcTime.getTime() + istOffset);
 
 // Format IST time as a string in 'YYYY-MM-DD HH:MM:SS' format
 const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');

 const sql = 'update user_time_sheet  set tea_break = $1  where username = $2 and emp_code = $3';
 const values = [istTimeString,employeeUsername,employeeCode,];

 connection.query(sql, values, (err, result) => {
  if (err) {
    console.error('Error updating data into MySQL: ' + err.message);
    res.status(500).json({ error: 'Error recording tea break.' });
    return;
  }
  console.log('Tea break recorded successfully.');
  res.status(200).json({ message: 'Tea break recorded successfully.' });
});
});




// Route to handle smoking break requests
app.post('/smokingbreak', (req, res) => {
  const { employeeCode, employeeUsername } = req.body;

 
  // console.log('Employee Code:', employeeCode);
  // console.log('Employee Username:', employeeUsername);
 

   // Get current UTC time
 const utcTime = new Date();
  
 // Calculate the offset for Indian Standard Time (IST) in milliseconds (UTC+5:30)
 const istOffset = 5.5 * 60 * 60 * 1000;
 
 // Calculate the current time in IST
 const istTime = new Date(utcTime.getTime() + istOffset);
 
 // Format IST time as a string in 'YYYY-MM-DD HH:MM:SS' format
 const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');

 const sql = 'update user_time_sheet set smoking_break = $1  where username = $2 and emp_code = $3';
 const values = [istTimeString,employeeUsername,employeeCode,];

 connection.query(sql, values, (err, result) => {
  if (err) {
    console.error('Error updating data into MySQL: ' + err.message);
    res.status(500).json({ error: 'Error recording smoking break.' });
    return;
  }
  console.log('smoking break recorded successfully.');
  res.status(200).json({ message: 'smoking break recorded successfully.' });
});
});



// Endpoint to retrieve timesheet data
app.get('/timesheet', (req, res) => {
  const { employeeCode, employeeUsername } = req.query;

  // Get today's date in the format 'YYYY-MM-DD'
  const todayDate = new Date().toISOString().slice(0, 10);

  const query = `
    SELECT time_in, time_out, tea_break, smoking_break 
    FROM user_time_sheet 
    WHERE emp_code = $1 
    AND username = $2 
    AND user_current_date = $3`;

  connection.query(query, [employeeCode, employeeUsername, todayDate], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results.rows);
  });
});