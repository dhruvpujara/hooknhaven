require('dotenv').config();
const express = require('express');
const session = require("express-session");

// external imports
const app = express();
const mongoose = require('mongoose');

// local imports
const port = 3000;
const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const rootdir = __dirname;




app.use(express.static('public'));
app.set('view engine', 'ejs');

app.set('views', [
    path.join(rootdir, 'views'),
    path.join(rootdir, 'views/admin'),
]);


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));


app.use('/', userRoutes);
app.use('/', adminRoutes);


// MongoDB connection
mongoose.connect(process.env.mongodb)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
