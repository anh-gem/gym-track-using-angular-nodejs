const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

exports.uploadImage = async (file) => {
  console.log("FILE:", file);
  const result = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
  });

  return {
    url: result.url,
    fileId: result.fileId,
  };
};

exports.deleteImage = async (fileId) => {
  return imagekit.deleteFile(fileId);
};
