/**
 * This file defines the User model for the MongoDB database.
 * The User model represents the users of the application,
 * and defines what data is stored for each user, including their username, 
 * number of faucets they've created, and their lifetime earnings.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    bananoAddress: { type: String, required: true },
    faucetsCreated: { type: Number, default: 0 },
    totalClaimed: { type: Number, default: 0 },
    totalGiven: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);