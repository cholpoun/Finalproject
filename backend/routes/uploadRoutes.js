// import express from 'express';
// import { parser } from '../middlewares/cloudinaryConfig.js';

// const router = express.Router();

// // Define an upload route
// router.post('/upload', parser.single('image'), (req, res) => {
//   try {
//     // Access the uploaded file details
//     const fileUrl = req.file.path; // Cloudinary URL of the uploaded file
//     res.status(200).json({ success: true, fileUrl });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Upload failed', error });
//   }
// });

// export default router;
