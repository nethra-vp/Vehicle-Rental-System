const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      favorites: user.favorites
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      favorites: user.favorites
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add vehicle to favorites
// @route   POST /api/users/favorites/:id
// @access  Private
const addToFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.favorites.includes(req.params.id)) {
        res.status(400);
        throw new Error('Already in favorites');
    }
    user.favorites.push(req.params.id);
    await user.save();
    res.json({ favorites: user.favorites });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove vehicle from favorites
// @route   DELETE /api/users/favorites/:id
// @access  Private
const removeFromFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      user.favorites = user.favorites.filter((fav) => fav.toString() !== req.params.id);
      await user.save();
      res.json({ favorites: user.favorites });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  addToFavorites,
  removeFromFavorites,
  getUsers
};
