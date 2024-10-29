const express = require('express');
const { getHomepage } = require('../controller/homeControler.js');
const router = express.Router();
const usersController = require('../controller/usersController.js');
const adminController = require('../controller/adminController.js');
const feedbackController = require('../controller/feedbackController.js');
const homePageController = require('../controller/homePageController.js');

router.get('/trang-chu', getHomepage);

router.get('/dang-ky', (req, res) => {
    res.render('signup.ejs');
})
router.get('/dang-nhap', (req, res) => {
    res.render('login.ejs');
})
router.get('/quen-mat-khau', (req, res) => {
    res.render('resetpassword')
})
router.post('/dang-nhap', usersController.login);
router.post('/reset-pwd', usersController.reset);
router.post('/create-users', usersController.create_users)
router.get('/homepage', (req, res) => {
    res.render('homepage');
})
    
router.get('/admin', adminController.adminHomepage)
router.get('/searchBookUser', (req, res) => {
    res.render('user/SearchBookUser')
})
router.get('/view-feedback', (req, res) => {
    res.render('admin/ViewFeedBack')
})
router.get('/ListUser', adminController.adminViewUser);

router.get('/list-borrow-user', (req, res) => {
    res.render('user/ListBorrowUser')
})
router.get('/list-borrow-admin', (req, res) => {
    res.render('admin/ListBorrowedUser')
})
router.get('/feedback', (req, res) => {
    res.render('user/feedback');
})
router.get('/ListBorrowAdmin/:action', adminController.getBookBorrow)
router.post('/DeleteUser', adminController.adminDeleteUSer);
router.get('/AdminViewUser/:username', adminController.adminViewUserInfo);
router.post('/ConfirmBorrowed', adminController.ConfirmBorrowed);
router.post('/ConfirmReturned', adminController.ConfirmReturned);
router.get('/ListBook', adminController.GetBook);
router.get('/AdminViewBook/:Id', adminController.GetInfoBook);
router.post('/AdminViewBook/UpdateBook', adminController.UpdateBookInfo);
router.get('/CreateBook', adminController.GetCreateBook);
router.post('/CreateBook', adminController.CreateBook);
router.get('/Logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/webtruyen/dang-nhap');
        }
    });
})
router.post('/feed_back', feedbackController.createFeedback);
router.post('/SearchBook', feedbackController.findBooksByCategory);
router.post('/actionBorrow', homePageController.insertBooksBorrower);
router.get('/user', homePageController.ShowAllBooks);
router.get('/ViewUser',usersController.getUserInfo);
router.get('/ListReturnedUser', homePageController.ListBookReturn);
router.get('/ListProcessingUser', homePageController.showBorrowedBooks)
router.get('/ListBorrowUser', homePageController.ListBorrow)
router.get('/ViewFeedBack', adminController.Viewfeedback);

module.exports = router;