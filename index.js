const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController');
const multer = require('multer'); // Import multer for file uploads
const path = require('path');
const sequelize = require('./db');
const Assignment = require('./models/assignment');

const app = express();
const PORT = process.env.PORT || 3000;
// Session middleware configuration
app.use(session({
  secret: 'your-secret-key', // Change this to a random secret key
  resave: false,
  saveUninitialized: false
}));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Store uploads in an 'uploads' folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
  }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Routes

// Signup route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Signup Route
app.post('/register', async (req, res) => {
  try {
    const registrationResult = await authController.register(req, res);
    if (registrationResult.success) {
      res.redirect('/home.html');
    } else {
      res.status(400).json({ message: registrationResult.message });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/upload', upload.single('assignmentFile'), async (req, res) => {

// Login Route
app.post('/login', async (req, res) => {
  try {
    await authController.login(req, res);
    res.redirect('/home.html');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Handle file upload using multer middleware
// Handle file upload using multer middleware
app.post('/upload', upload.single('assignmentFile'), async (req, res) => {
  try {
    // If the file is successfully uploaded, req.file will contain the file information
    // Extract relevant information from the request
    const { title, description } = req.body;
    const fileUrl = req.file.path; // Assuming req.file.path contains the path of the uploaded file

    // Ensure that req.session.userId is set
    if (!req.session.userId) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }

    console.log('Creating assignment record...');
    // Create a new assignment record in the database
    const assignment = await Assignment.create({
      title: title,
      description: description,
      file_content: fileUrl, // Store the file URL or path in the database
      user_id: req.session.userId // Use the user_id from session
    });

    console.log('Assignment created:', assignment);

    // Redirect to assignments page after upload
    res.redirect('/assignments');
  } catch (error) {
    console.error('Error uploading assignment:', error);
    res.status(500).json({ message: 'Failed to upload assignment' });
  }
});

// Assignments Route
app.get('/assignments', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'assignments.html'));
});

// Home Route
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Ask Route
app.get('/ask', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ask.html'));
});

// Cheats Route
app.get('/cheats', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cheats.html'));
});

// Upload Route
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// AI Route
app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ai.html'));
});

app.get('/kyxweb', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'kyxweb.html'));
});

// Sync models with database
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
.catch(error => {
   console.error('Error syncing models:', error);
      });