const mongoose = require('mongoose');

const faucetClaimSchema = new mongoose.Schema({
    bananoAddress: { type: String, required: true },
    deviceId: { type: String, required: true },
    faucetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faucet', required: true },
    claimedAt: { type: Date, default: Date.now },
    claimAmount: { type: Number, required: true },
});

module.exports = mongoose.model('FaucetClaim', faucetClaimSchema);
