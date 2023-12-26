const S3 = require("aws-sdk/clients/s3");

const {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY
} = require("../../utils/config");

const s3 = new S3({
  region: AWS_BUCKET_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY
});

const uploadImage = async ({ key, body, contentType }) => {
  const payload = {
    Bucket: AWS_BUCKET_NAME,
    Body: body,
    Key: key,
    ContentEncoding: "base64",
    ContentType: contentType
  };

  return await s3.upload(payload).promise();
};

module.exports = { uploadImage };
