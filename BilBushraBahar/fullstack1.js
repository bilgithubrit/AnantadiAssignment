// This example uses the multer middleware to handle the file upload. It defines a route that accepts
//  POST requests to the /upload endpoint, with two separate file fields: videos and json. The videos 
//  field accepts up to three video files, while the json field accepts one JSON file. When the route
//   is hit, the uploaded files are processed and logged to the console. You can modify the code to fit your
// specific use case, such as by uploading the videos to S3 or saving the JSON object to a database.

const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Set up the storage engine for multer to use
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Create the multer upload middleware
const upload = multer({ storage: storage });

// Define a route to handle the upload
app.post('/upload', upload.fields([
  { name: 'videos', maxCount: 3 },
  { name: 'json', maxCount: 1 }
]), (req, res) => {
  // Process the uploaded videos
  const videos = req.files['videos'];
  videos.forEach(video => {
    console.log(`Received video file: ${video.originalname}`);
    // Do something with the video file, such as uploading it to S3
  });

  // Process the uploaded JSON object
  const json = req.files['json'][0];
  console.log(`Received JSON file: ${json.originalname}`);
  const jsonObject = JSON.parse(fs.readFileSync(json.path));
  // Do something with the JSON object, such as saving it to a database

  res.send('Files uploaded successfully');
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});