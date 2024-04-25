const bcrypt = require('bcrypt');
const User = require('../models/user');

async function register(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    // If the username doesn't exist, proceed with user registration
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    // Set authentication status in session after registration
    req.session.user = username; // Storing username in session

    return { success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Set authentication status in session after login
    req.session.user = user.username; // Storing username in session

    // Redirect the user to the home page
    res.redirect('/');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}

module.exports = { register, login };
