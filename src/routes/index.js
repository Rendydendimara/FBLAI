const { PostFileUseCase } = require('../usecase');

const express = require('express');
const { uploadFile } = require('../config/multer/file');

const mainRouter = express.Router();

mainRouter.post('/post-file', uploadFile.single('file'), PostFileUseCase)

module.exports = { mainRouter };