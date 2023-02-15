// here's an example of how you can use Node.js and the aws-sdk module to list the objects in an 
// S3 bucket and expose endpoints through API Gateway to retrieve the list of uploaded videos on S3
// and its details:

const AWS = require('aws-sdk');
const express = require('express');

const app = express();

// Set up the S3 client
const s3 = new AWS.S3({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key'
});

// Define a route to get the list of uploaded videos
app.get('/videos', (req, res) => {
  const s3Params = {
    Bucket: 'your-bucket-name'
  };
  s3.listObjects(s3Params, (err, data) => {
    if (err) {
      console.error(err);
      res.send('Failed to get the list of videos');
    } else {
      const videos = data.Contents.filter((obj) => obj.Key.endsWith('.mp4')).map((obj) => {
        return {
          name: obj.Key,
          url: `https://${s3Params.Bucket}.s3.amazonaws.com/${obj.Key}`,
          size: obj.Size,
          lastModified: obj.LastModified
        };
      });
      res.json(videos);
    }
  });
});

// Define a route to get the details of a specific video
app.get('/videos/:name', (req, res) => {
  const name = req.params.name;
  const s3Params = {
    Bucket: 'your-bucket-name',
    Key: name
  };
  s3.headObject(s3Params, (err, data) => {
    if (err) {
      console.error(err);
      res.send('Failed to get the video details');
    } else {
      const video = {
        name: s3Params.Key,
        url: `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`,
        size: data.ContentLength,
        lastModified: data.LastModified
      };
      res.json(video);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});