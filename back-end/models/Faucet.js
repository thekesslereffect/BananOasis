/**
 * This file defines the Faucet model for the MongoDB database.
 * The Faucet model represents the faucets in the application,
 * and defines what data is stored for each faucet, including the owner's username,
 * location, radius, and the amount of Banano it contains.
 */

const mongoose = require('mongoose');

const faucetSchema = new mongoose.Schema({
    bananoAddress: { type: String, required: true },
    location: { 
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } 
    },
    radius: { type: Number, required: true },
    bananoAmount: { type: Number, required: true },
    claimAmount: { type: Number, required: true },
});

faucetSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Faucet', faucetSchema);
