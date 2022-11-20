const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const AWS = require('aws-sdk');

const multer = require('multer');
const sharp = require('sharp');

const {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} = require('@aws-sdk/client-s3');
const AppError = require('./AppError');

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//   },
//   region: process.env.AWS_BUCKET_REGION,
// });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

//Multer Related
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadProductPhoto = upload.single('image');

//Photo resizing with sharp
exports.resizeProductPhoto = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please provide a photo!', 400));
  }
  if (req.file.mimetype.split('/')[0] !== 'image') {
    return next(new AppError('Please a photo file!', 400));
  }
  req.contentType = req.file.mimetype.split('/')[0];
  req.buffer = await sharp(req.file.buffer)
    .resize(500, 400)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toBuffer();

  next();
};

exports.uploadPhotoToS3 = async (req, res, next) => {
  if (!req.buffer) {
    return next(new AppError('There is no file to upload!', 400));
  }

  const image = `${req.user.id}-${Date.now() * Math.random()}.jpeg`;

  const { Location } = await s3
    .upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: image,
      Body: req.buffer,
      ContentType: req.contentType,
    })
    .promise();

  return res.status(200).json({ status: 'success', data: { image: Location } });
};

exports.uploadVideoToS3 = async (req, res, next) => {
  if (!req.files.urlName || req.files.imgName) {
    return res.status(400).json({
      status: 'fail',
      message: 'Lecture must have a video and image attach to it',
    });
  }
  try {
    req.urlName = `${req.user.id}-${Date.now() * Math.random()}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.urlName,
      Body: req.files.urlName[0].buffer,
      ContentType: req.files.urlName[0].mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (err) {
    next(err);
  }
  next();
};

exports.getObject = async (Key) => {
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
  };
  const command = new GetObjectCommand(getObjectParams);
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

exports.deleteObject = async (Key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};
