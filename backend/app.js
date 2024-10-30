const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User, Section } = require('./userDetails'); // Import User and Section models
const multer = require("multer");
const xlsx = require('xlsx');
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
app.use(cors({
  origin: '*', // Replace with your React frontend URL
  credentials: true, // Allow cookies or credentials to be sent across domains
}));
app.use(express.json());
const helmet = require('helmet');
app.use(helmet());
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);
const mongoUrl = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5001; // Default to port 5001 if PORT is not defined

// Database connection
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.error("Connection error: ", e);
  });

// Basic Route
app.get("/", (req, res) => {
    res.send({ status: "Started" });
});

// Register Route
app.post('/register', async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        // Check if user already exists
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            return res.status(409).send({ message: "User already exists" }); // 409 Conflict
        }

        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            name,
            email,
            mobile,
            password: encryptedPassword,
        });

        res.status(201).send({
            status: "ok",
            message: "User Created",
        });

    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Failed to create user",
            error: error.message,
        });
    }
});

// Login Route
app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await User.findOne({ email: email });
        if (!oldUser) {
            return res.status(404).send({
                status: "error",
                message: "User doesn't exist!",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                status: "error",
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: "1h" }); // Add token expiration

        return res.status(200).send({
            status: "ok",
            data: token, // Returning the token
        });

    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Login failed",
            error: error.message,
        });
    }
});

app.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET); // Verify and decode the token
      const useremail = user.email;
  
      // Fetch user data based on the email extracted from the token
      const userData = await User.findOne({ email: useremail });
  
      if (!userData) {
        return res.status(404).send({ status: "error", message: "User not found" });
      }
  
      return res.send({ status: "ok", data: userData });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  });
  
// Sections
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/addSection', upload.single('file'), async (req, res) => {
  const { sectionName } = req.body;

  try {
    if (!req.headers.authorization) {
      return res.status(401).send({ status: 'error', message: 'Authorization header missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userEmail = decodedToken.email;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ status: 'error', message: 'User not found' });
    }

    const userId = user._id.toString();

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const studentNames = sheetData.map(row => row[0]).filter(Boolean);

    const newSection = new Section({
      sectionName,
      studentNames,
      userId,
    });

    // console.log('File Uploaded:', req.file);

    await newSection.save();
    res.status(201).send({ status: 'ok', message: 'Section added', data: newSection });
  } catch (error) {
    console.error('Full Error Object:', error);
    res.status(500).send({ status: 'error', message: 'Failed to add section', error: error.message });
  }
});
app.get('/sections', async (req, res) => {
    try {
      // Check for Authorization header
      if (!req.headers.authorization) {
        return res.status(401).send({ status: 'error', message: 'Authorization header missing' });
      }
  
      // Extract the token and verify it
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const userEmail = decodedToken.email;
  
      // Fetch the user to get their ObjectId
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).send({ status: 'error', message: 'User not found' });
      }
  
      // Use the userId to find all sections linked to this user
      const sections = await Section.find({ userId: user._id.toString() });
  
      // Return the list of sections
      res.status(200).send({ status: 'ok', data: sections });
    } catch (error) {
      console.error('Error fetching sections:', error);
      res.status(500).send({ status: 'error', message: 'Failed to fetch sections', error: error.message });
    }
  });

  app.delete('/deleteSection/:sectionId', async (req, res) => {
    const { sectionId } = req.params;
  
    try {
      // Find the section by ID and delete it
      const deletedSection = await Section.findByIdAndDelete(sectionId);
  
      if (!deletedSection) {
        return res.status(404).send({
          status: 'error',
          message: 'Section not found',
        });
      }
  
      res.status(200).send({
        status: 'ok',
        message: 'Section deleted successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'Failed to delete section',
        error: error.message,
      });
    }
  });



// Start Server
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
