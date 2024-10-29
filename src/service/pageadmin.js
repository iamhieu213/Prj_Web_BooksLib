const pool = require('../config/database');
const express = require('express');
const moment = require('moment');

const getNumberBooks = async () => {
    let result = await pool.query('SELECT COUNT (id) FROM book ');
    return result;
}
const getNumberUsers = async () => {
    let result = await pool.query('SELECT COUNT (username) FROM users');
    return result;
}
const getNumberBooks_Borrowed = async () => {
    const query = 'SELECT COUNT(book_id) FROM borrower WHERE status = $1'
    const result = await pool.query(query, ["Borrowed"]);
    return result;
}
const getNumberProcess = async () => {
    const query = 'SELECT COUNT(book_id) FROM borrower WHERE status = $1'
    const result = await pool.query(query, ["Processing"]);
    return result;
}
const getTopBorrower = async () => {
    const query = 'SELECT username, COUNT(*) AS borrow_count FROM borrower GROUP BY username ORDER BY borrow_count DESC LIMIT 5;'
    const result = await pool.query(query);
    return result;
}
const getTopBook = async () => {
    const query = 'SELECT b.name, COUNT(*) AS borrow_count FROM borrower bo JOIN book b ON bo.book_id = b.id GROUP BY b.name ORDER BY borrow_count DESC LIMIT 5;'
    const result = await pool.query(query);
    return result;
}
const listUsers = async () => {
    const query = 'SELECT * FROM users WHERE role = $1 ';
    const result = await pool.query(query, ["0"]);
    return result;
}
const ViewUserInfo = async (username) => {
    try {   
        const query = 'SELECT * FROM users WHERE username = $1'
        const result = await pool.query(query, [username]);
        return result;

    } catch (error) {
        console.error('Lỗi khi xem thông tin người dùng:', error);
        res.status(500).send('Có lỗi xảy ra');
    }
}
const GetListBookProcessing = async () => {
    try {
        const query = 'select bo.id , bo.username, bo.from_date, bo.to_date, bo.status , b.name FROM borrower bo LEFT JOIN book b ON bo.book_id = b.id WHERE status = $1'
        const result = await pool.query(query, ['Processing']);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}

const GetListBookBorrowed = async () => {
    try {
        const query = 'select bo.id , bo.username, bo.from_date, bo.to_date, bo.status , b.name FROM borrower bo LEFT JOIN book b ON bo.book_id = b.id WHERE status = $1 OR status = $2'
        const result = await pool.query(query, ['Borrowed', 'Late']);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}

const GetListBookReturned = async () => {
    try {
        const query = 'select bo.id , bo.username, bo.from_date, bo.to_date, bo.status , b.name FROM borrower bo LEFT JOIN book b ON bo.book_id = b.id WHERE status = $1'
        const result = await pool.query(query, ['Returned']);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}
const GetAllBook = async () => {
    try {
        const query = ' SELECT id , name , author , total  , current FROM book ';
        let result = await pool.query(query);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}
const ViewInfoBook = async (Id) => {
    try {
        const query = `
            SELECT 
                b.id AS book_id, 
                b.name AS book_name, 
                b.author, 
                b.publisher,
                c.name AS category_name,
                b.category,
                b.total, 
                b.current
            FROM book b 
            LEFT JOIN category c ON c.id = b.category 
            WHERE b.id = $1
        `;
        const result = await pool.query(query, [Id]);

        if (result.rows.length === 0) {
            throw new Error(`Book with ID ${Id} not found.`);
        }

        // Trả về hàng đầu tiên tìm thấy (thông tin sách)
        return result.rows[0];
    } catch (error) {
        console.error('Lỗi khi truy xuất sách: ', error);
        throw new Error('Database query failed');
    }
};



const GetAllCategory = async () => {
    try {
        const result = await pool.query('SELECT category FROM book  ');
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}
function convertEmptyToNullInObject(obj) {
    const converted = {};
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            converted[key] = obj[key] === "" ? null : obj[key];
        }
    }
    return converted;
}
const GetAllFeedback = async () => {
    try {
        const query = 'SELECT * FROM feedback';
        const result = await pool.query(query);
        return result;
    } catch (error) {
        console.error('Loi khi truy feedback : ', error);
        res.status(500).send('Co loi xay ra');
    }
}
module.exports = {
    getNumberBooks,
    getNumberUsers,
    getNumberBooks_Borrowed,
    getNumberProcess,
    listUsers,
    ViewUserInfo,
    GetListBookProcessing,
    GetListBookReturned,
    GetListBookBorrowed,
    GetAllBook,
    GetAllCategory,
    ViewInfoBook,
    convertEmptyToNullInObject,
    getTopBorrower,
    getTopBook,
    GetAllFeedback
}