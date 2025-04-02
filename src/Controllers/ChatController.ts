import { Request, Response } from "express";
import AWS from "aws-sdk";
import { ChatHandler } from "../Core/ChatHandler";
import { ChatMessage } from "../Models/ChatModel";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME as string;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials are not defined in the environment variables.");
}

AWS.config.update({
  region: region,
  credentials: new AWS.Credentials({
    accessKeyId,
    secretAccessKey,
  }),
});

const s3 = new AWS.S3();

const getChatHistoryHandler = async (key: string, res: Response) => {
    const params = {
        Bucket: bucketName,
        Key: `${key}.json`,
    };
    
    try {
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body?.toString() || "[]");
    } catch (error: any) {
        console.error("Error fetching object from S3:", error);
        res.status(500).json({ error: "Failed to fetch chat history", details: error.message });
    }
}

export const getChatHistory = async (req: Request, res: Response) => {
  const key = req.query.key as string;

  try {
    const params = {
      Bucket: bucketName,
      Key: `${key}.json`,
    };

    try {
      const data = await s3.getObject(params).promise();
      const history = JSON.parse(data.Body?.toString() || "[]");
      res.status(200).json(history);
    } catch (error: any) {
      console.error("Error fetching object from S3:", error);
      if (error.code === "NoSuchKey" || error.statusCode === 404) {
        // File not found, create it
        const initialHistory: any = [];
        await s3
          .putObject({
            Bucket: params.Bucket,
            Key: params.Key,
            Body: JSON.stringify(initialHistory),
            ContentType: "application/json",
          })
          .promise();
        res.status(201).json(initialHistory);
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch or create chat history", details: error.message });
  }
};

export const postOngoingAgent = async (req: Request, res: Response) => {
    const { key, content= '' } = req.body;

    const chatHandler = new ChatHandler(key);
    const chatHistory: ChatMessage[] = [];
    const historyResponse: ChatMessage[] = await getChatHistoryHandler(key, res);

    if (historyResponse) {
        chatHistory.push(...historyResponse); // Append user message
        chatHandler.setHistoryArray(chatHistory);
    }


   try {
    const response = await chatHandler.sendMessage(content);
    const params = {
      Bucket: bucketName,
      Key: `${key}.json`,
      Body: JSON.stringify(chatHandler.getHistory()),
      ContentType: "application/json",
    };

    await s3.putObject(params).promise();
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};
