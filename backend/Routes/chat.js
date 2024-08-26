const express = require('express');
const { questionAnswer, uploadDoc } = require('../Controllers/chat');
const multer = require('multer');
const router = express.Router();

// Initialize Multer
const upload = multer();

// Use the multer `upload.single('document')` middleware to handle single file uploads
router.post('/question', questionAnswer);
router.post('/upload', upload.single('document'), uploadDoc);

module.exports = router;
