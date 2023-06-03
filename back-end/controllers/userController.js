/**
 * This file contains controller functions for the User-related routes.
 * Controller functions receive HTTP requests, interact with the models to perform CRUD operations,
 * and send HTTP responses.
 */

const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { bananoAddress } = req.body;

    // Validate banano address
    const isValidBananoAddress = /^ban_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/.test(bananoAddress);
    
    if (!isValidBananoAddress) {
        return res.status(400).send({ message: 'Invalid Banano address!' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ bananoAddress });

    if (user) {
        return res.status(400).send({ message: 'User already exists' });
    }

    // If user doesn't exist, create a new one
    user = new User({ bananoAddress });
    await user.save();

    res.status(201).send({ message: 'User created successfully' }); 
};

// Invoke-RestMethod -Uri "http://localhost:3000/api/createUser" -Method Post -ContentType "application/json" -Body '{"bananoAddress":"ban_1cosmic1qkfnur4xnqdz3hy8zpofjxqzgpibm8ei3hnohfa8owbky91jnmtk"}'


exports.getUserDetails = async (req, res) => {
    const { bananoAddress } = req.params;

    const user = await User.findOne({ bananoAddress });

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Specify what data to send back
    const userData = {
        bananoAddress: user.bananoAddress,
        faucetsCreated: user.faucetsCreated,
        totalClaimed: user.totalClaimed,
        totalGiven: user.totalGiven
    }

    res.status(200).send(userData);
};

// Invoke-RestMethod -Uri "http://localhost:3000/api/getUserDetails/ban_1cosmic1qkfnur4xnqdz3hy8zpofjxqzgpibm8ei3hnohfa8owbky91jnmtk" -Method Get

