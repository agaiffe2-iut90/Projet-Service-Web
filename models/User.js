const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    githubId: String,
    displayName: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: String,
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;