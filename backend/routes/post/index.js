const Post = require("../../models/Post");
const multer = require('multer');
var router = require("express").Router();
const path = require('path');
const fs = require('fs');

// @AssetPlus: This is a sample get request
router.get("/", async (req, res) => {
    var posts = await Post.find();
    return res.send(posts);
});

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'uploads');
      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
        }
        cb(null, uploadPath);
      });
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

  // Function to convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const filePath = path.join( file.path);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const base64Data = data.toString('base64');
          const base64Image = `data:image/jpeg;base64,${base64Data}`;
          resolve(base64Image);
        }
      });
    });
  };

  // Route for fetching images
router.get('/images', async(req, res) => {
    try{
     const images = await Post.find()
     res.status(200).send({message : "Image successfully fetched",success:true,data:images})
    }catch(error){
        console.log("Err=====",error)
      res.status(500).send({message : "Internal server Error",success:false,data:{}})
    }
  });

   // Route for upload images
router.post('/upload', upload.single('image'), async(req, res) => {
    try{
    // Convert uploaded image to base64
    const base64Image = await fileToBase64(req.file);

    // Create a new post instance with base64 image
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      imageData: base64Image, // Store base64 image in database
    });

    // Save the post to MongoDB
    await newPost.save();
        res.status(200).send({message : "Image successfully upload",success:true,data:{}})
    }catch(error){
        console.log("Err=====",error)
        res.status(500).send({message : "Internal server Error",success:false,data:{}})
    }
  });
  

// @AssetPlus: Add other routes here
// router.post("/add")

module.exports = router;