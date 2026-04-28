const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  addToFavorites,
  removeFromFavorites,
  getUsers
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.post('/favorites/:id', protect, addToFavorites);
router.delete('/favorites/:id', protect, removeFromFavorites);
router.get('/', protect, admin, getUsers);

module.exports = router;
