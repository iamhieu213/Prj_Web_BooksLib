const pool = require('../config/database');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();


// Function to create a new user (signup)
async function create_users(req, res) {
  const { firstname, lastname, sex, username, email, password, datebirth, confirmpassword } = req.body;

  if (!firstname || !lastname || !sex || !username || !email || !password || !datebirth) {
    return res.render('signup', { error: 'Hãy điền đầy đủ thông tin!' });
  }

  if (password !== confirmpassword) {
    return res.render('signup', { error: 'Kiểm tra lại mật khẩu!' });
  }

  try {
    const emailQuery = 'SELECT 1 FROM users WHERE email = $1';
    const usernameQuery = 'SELECT 1 FROM users WHERE username = $1';

    const [emailResult, usernameResult] = await Promise.all([
      pool.query(emailQuery, [email]),
      pool.query(usernameQuery, [username])
    ]);

    if (emailResult.rows.length > 0) {
      return res.render('signup', { error: 'Email đã được sử dụng!' });
    }

    if (usernameResult.rows.length > 0) {
      return res.render('signup', { error: 'Username đã được sử dụng!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (firstname, lastname, sex, username, email, password, datebirth)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    await pool.query(insertQuery, [firstname, lastname, sex, username, email, hashedPassword, datebirth]);

    // Redirect AFTER successful insertion
    res.redirect('../webtruyen/dang-nhap?success=Đăng ký thành công!');
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Function to handle user login
async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Vui lòng điền cả email và mật khẩu");
  }

  try {
    // Truy vấn thông tin người dùng, bao gồm cả role
    const query = 'SELECT * FROM users WHERE email = $1 ';
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.render('login', { error: 'Email hoặc mật khẩu không đúng!' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Email hoặc mật khẩu không đúng!' });
    }

    // Lấy role từ kết quả truy vấn
    const role = user.role;
    // Lưu vai trò vào session
    req.session.role = role;
    req.session.username = user.username

    console.log(req.session.username);

    if (role === 1) {
      res.redirect('../webtruyen/admin');
    } else {
      res.redirect('../webtruyen/user');
    }
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    next(error); // Pass the error to your error handling middleware
  }
}


// Function to reset password
async function reset(req, res) {
  const { email, new_password, confirm_new_password } = req.body;

  if (!email || !new_password || !confirm_new_password) {
    return res.status(400).send("Vui lòng điền cả email và mật khẩu mới");
  }
  if (new_password !== confirm_new_password) {
    return res.status(400).send("Mật khẩu mới không khớp, vui lòng kiểm tra lại");
  }

  try {
    const query1 = 'SELECT email FROM users WHERE email = $1';
    const result1 = await pool.query(query1, [email]);

    if (result1.rowCount === 0) {
      return res.status(400).send("Email không tồn tại trong hệ thống");
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    const query2 = 'UPDATE users SET password = $1 WHERE email = $2 RETURNING *;';
    const result2 = await pool.query(query2, [hashedPassword, email]);
    res.redirect('../webtruyen/dang-nhap?success=Mật khẩu đã được đặt lại thành công!');
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
}
// userController.js
async function getUserInfo(req, res) {
  const username = req.session.username; 

  if (!username) {
      return res.status(401).send('Bạn cần đăng nhập để xem thông tin.'); 
  }

  try {
      const query = 'SELECT * FROM users WHERE username = $1;'; 
      const result = await pool.query(query, [username]);


      if (result.rowCount === 0) {
          return res.status(404).send('Người dùng không tồn tại.'); 
      }

      res.render('user/ViewUser', { userinfo: result.rows[0] });
      console.log(result);
  } catch (error) {
      console.error('Lỗi truy vấn:', error); 
      res.status(500).send('Lỗi máy chủ nội bộ'); 
  }
}


async function UpdateUserInfo(req, res) {
  const { username, sex, datebirth } = req.body;
  try {
    const query = 'UPDATE users SET sex = $1, datebirth = $2 WHERE username = $3; '
    const result = await pool.query(query, [sex, datebirth, username])
    console.log('thanhcong');
    res.redirect('../webtruyen/test11')
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
}






module.exports = {
  create_users,
  login,
  reset,
  getUserInfo,
  UpdateUserInfo,
}
