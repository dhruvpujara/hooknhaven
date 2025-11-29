const e = require('express');
const mongoose = require('mongoose');

userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
        minimum: 10,
        maximum: 10,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('User', userSchema);