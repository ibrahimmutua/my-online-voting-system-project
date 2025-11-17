// server/index.js

const express = require('express');
const cors = require('cors');
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const Routes = require("./routes/Routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ================== CORS CONFIG ==================
const allowedOrigins = [
  "http://localhost:3000",
  "https://my-online-voting-system-project.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// =================================================

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload
app.use(upload());

// Routes
app.use('/api', Routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => console.log(err));
