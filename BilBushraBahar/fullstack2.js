// This example uses the multer middleware to handle the file upload.
//  It defines a route that accepts POST requests to the /upload endpoint,
//   with a single file field named file. The uploaded file is then checked to
//    see if it is a video file or a JSON file. If it is a video file, 
//    it is uploaded to an S3 bucket using the aws-sdk module. If it is a JSON file, 
//    it is read and its contents are printed to the console. You will need to modify the
//     code to fit your specific use case and replace the placeholder values with your own values.

const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
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

// Set up the S3 client
const s3 = new AWS.S3({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key'
});

// Define a route to handle the upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Check if the uploaded file is a video or a JSON file
  const file = req.file;
  if (file.mimetype.startsWith('video/')) {
    // Upload the video file to S3
    const s3Params = {
      Bucket: 'your-bucket-name',
      Key: file.originalname,
      Body: fs.createReadStream(file.path)
    };
    s3.upload(s3Params, (err, data) => {
      if (err) {
        console.error(err);
        res.send('Failed to upload file to S3');
      } else {
        console.log(`File uploaded to S3 at ${data.Location}`);
        res.send('File uploaded successfully');
      }
    });
  } else if (file.mimetype === 'application/json') {
    // Read the JSON file and print its contents
    const jsonObject = JSON.parse(fs.readFileSync(file.path));
    console.log(jsonObject);
    res.send('JSON file uploaded and printed to console');
  } else {
    res.send('Unsupported file type');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});