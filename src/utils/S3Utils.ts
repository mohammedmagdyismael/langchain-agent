import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const getObjectFromS3 = async (bucket: string, key: string) => {
  const params = { Bucket: bucket, Key: key };
  return s3.getObject(params).promise();
};

export const putObjectToS3 = async (bucket: string, key: string, body: string) => {
  const params = { Bucket: bucket, Key: key, Body: body, ContentType: "application/json" };
  return s3.putObject(params).promise();
};
