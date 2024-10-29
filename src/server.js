require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const configViewengine = require('./config/viewEngine');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME;
const webRoute = require('./routes/web');
app.use(express.json());

const oneday = 1000 * 60 * 60 * 24;
app.use(session({
    secret: '21102004',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneday },
}));
//config engine 
configViewengine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/webtruyen', webRoute);

app.listen(port, hostname, () => {
    console.log(`Server is running on port ${port}`);
});