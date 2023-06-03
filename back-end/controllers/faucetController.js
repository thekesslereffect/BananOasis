/**
 * This file contains controller functions for the Faucet-related routes.
 * Controller functions receive HTTP requests, interact with the models to perform CRUD operations,
 * and send HTTP responses.
 */

const User = require('../models/User');
const Faucet = require('../models/Faucet');
const FaucetClaim = require('../models/FaucetClaim');
const COOLDOWN_PERIOD = 60 * 1000; //60 * 60 * 1000; 1 hour

exports.getAvailableFaucets = async (req, res) => {
    try {
        const faucets = await Faucet.find({});
        res.status(200).send(faucets);
    } catch (err) {
        res.status(500).send({ message: 'Server Error: Could not fetch available faucets' });
    }
};
// Invoke-RestMethod -Uri "http://localhost:3000/api/getAvailableFaucets" -Method Get

exports.createFaucet = async (req, res) => {
    const { bananoAddress, location, radius, bananoAmount, claimAmount  } = req.body;

    const user = await User.findOne({ bananoAddress });

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const [longitude, latitude] = location.coordinates;
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        return res.status(400).send({ message: 'Invalid coordinates' });
    }

    const newFaucet = new Faucet({ bananoAddress, location, radius, bananoAmount, claimAmount });
    await newFaucet.save();

    await User.findOneAndUpdate({ bananoAddress }, { $inc: { faucetsCreated: 1, totalGiven: bananoAmount }} );

    res.status(200).send({ message: 'Faucet created successfully' });
};

// Invoke-RestMethod -Uri "http://localhost:3000/api/createFaucet" -Method Post -ContentType "application/json" -Body '{"bananoAddress":"ban_1cosmic1qkfnur4xnqdz3hy8zpofjxqzgpibm8ei3hnohfa8owbky91jnmtk","location":{"coordinates":[-123.1234,45.1234]},"radius":50,"bananoAmount":100, "claimAmount":50}'

exports.claimFaucet = async (req, res) => {
    const { bananoAddress, deviceId, location, faucetId } = req.body;

    
    // Find the user first
    const user = await User.findOne({ bananoAddress });

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const faucet = await Faucet.findById(faucetId);
    
    if (!faucet) {
        return res.status(404).send({ message: 'Faucet not found' });
    }

    if (faucet.bananoAddress == bananoAddress) {
        return res.status(404).send({ message: 'You own this faucet!' });
    }

    const userDistance = calculateDistance(location, faucet.location.coordinates);
    
    if (userDistance > faucet.radius) {
        return res.status(400).send({ message: 'Not within faucet reach' });
    }

    // Check for a recent claim by address AND deviceId
    const lastAddressClaim = await FaucetClaim.findOne({ bananoAddress: user.bananoAddress, faucetId: faucet._id }).sort({ claimedAt: -1 });
    if (lastAddressClaim && (Date.now() - lastAddressClaim.claimedAt.getTime()) < COOLDOWN_PERIOD) {
        return res.status(400).send({ message: 'You can only claim from this faucet every hour' });
    }
    const lastDeviceClaim = await FaucetClaim.findOne({ deviceId: deviceId, faucetId: faucet._id }).sort({ claimedAt: -1 });
    if (lastDeviceClaim && (Date.now() - lastDeviceClaim.claimedAt.getTime()) < COOLDOWN_PERIOD) {
        return res.status(400).send({ message: 'You can only claim from this faucet every hour. Even if you switch your address.' });
    }

    // If remaining bananoAmount is less than claimAmount, user claims whatever is left
    let actualClaimAmount;

    if (faucet.bananoAmount <= faucet.claimAmount) {
        actualClaimAmount = faucet.bananoAmount;
        await Faucet.findByIdAndDelete(faucetId);
    } else {
        actualClaimAmount = faucet.claimAmount;
        await Faucet.findByIdAndUpdate(faucetId, { $inc: { bananoAmount: -actualClaimAmount }}); 
    }

    await User.findOneAndUpdate({ bananoAddress }, { $inc: { totalClaimed: actualClaimAmount }});

    // Create a new claim record
    const claim = new FaucetClaim({ bananoAddress: user.bananoAddress, deviceId: deviceId, faucetId: faucet._id, claimAmount: actualClaimAmount });
    await claim.save();

    res.status(200).send({ message: 'Faucet claimed successfully' });
};
//Invoke-RestMethod -Uri "http://localhost:3000/api/claimFaucet" -Method Post -ContentType "application/json" -Body '{"bananoAddress":"ban_1cosmic1qkfnur4xnqdz3hy8zpofjxqzgpibm8ei3hnohfa8owbky91jnmtk","deviceId":"x","location":{"coordinates":[-123.1234,45.1234]},"faucetId":"647a5b1c1fd5e4a19eee1356"}'

function calculateDistance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(coord2[1]-coord1[1]); 
    const dLon = deg2rad(coord2[0]-coord1[0]); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(coord1[1])) * Math.cos(deg2rad(coord2[1])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
