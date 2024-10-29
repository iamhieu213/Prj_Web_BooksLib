const pool = require('../config/database');
const session = require('express-session');
require('dotenv').config();

// Function to create a new feedback entry
async function createFeedback(req, res) {
    const { title, content } = req.body;
    const username = req.session.username;

    if (!title || !content) {
        return res.render('send_feedback', { error: 'Hãy điền đầy đủ thông tin!' });
    }

    try {
        const insertQuery = `
      INSERT INTO feedback (user_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const result = await pool.query(insertQuery, [username, title, content]);

        res.redirect('/webtruyen/feedback');
    } catch (error) {
        console.error('Error inserting feedback:', error);
        res.status(500).send('Internal Server Error');
    }
}
// Funtion to find books

async function findBooksByCategory(req, res) {
    const { name } = req.body;  // Lấy tên sách từ query string
    console.log(name);

    if (!name) {
        return res.status(400).json({ error: 'Book name is required' });  // Kiểm tra nếu không có tên sách, trả về lỗi 400
    }

    try {
        const findbook = await pool.query(
            'SELECT * FROM book WHERE name ILIKE $1',  // Truy vấn tìm sách theo tên không phân biệt hoa thường
            [`%${name}%`]  // Sử dụng tham số để tránh SQL Injection
        );
        //console.log(result);
        res.render('user/SearchBookUser', { findbook: findbook }) // Trả về kết quả truy vấn dưới dạng JSON
        // res.render('./user/SearchBookUser.ejs', {
        // data: result
        //})
    } catch (error) {
        console.error('Error executing query', error.stack);  // In ra lỗi nếu có
        res.status(500).json({ error: 'Internal server error' });  // Trả về lỗi 500 nếu có lỗi trong quá trình truy vấn
    }
};


module.exports = {
    createFeedback,
    findBooksByCategory
}
