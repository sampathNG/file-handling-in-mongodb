require('dotenv').config()
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const crypto = require("crypto")
const multer = require("multer")
const path = require("path")
const {GridFsStorage} = require("multer-gridfs-storage")
const Grid = require("gridfs-stream")

const mongoURI = process.env.URL
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname)
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });

// uploading images
router.post("/",upload.single("img"),(req,res)=>{
    res.json({file:req.file})
})


// getting images
router.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files),console.log(files)
  });
});

// get single image

router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file),console.log(file);
  });
});

// displaying image after retreiving it from database

router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// delete images by id

router.delete('/files/:filename', (req, res) => {
  gfs.files.deleteOne({ filename: req.params.filename}, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.send("succesfully deleted")
    console.log("deleted")
  });
});

// deleting all images from database

router.delete('/files', (req, res) => {
  gfs.files.deleteMany((err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.send("succesfully deleted")
    console.log("deleted")
  });
});





module.exports = router