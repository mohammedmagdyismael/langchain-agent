require('dotenv').config();

import { ChatHandler } from "./Core/ChatHandler";
import * as readline from "readline";

const run = async () => {
  const chatHandler = new ChatHandler('');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Chat started! Type your message below (type 'exit' to quit):");

  const promptUser = () => {
    rl.question("> ", async (input) => {
      if (input.toLowerCase() === "exit") {
        console.log("Chat ended.");
        rl.close();
        return;
      }
      try {
        const response = await chatHandler.sendMessage(input);
        console.log(`AI: ${response}`);
      } catch (error) {
        console.error("Error:", error);
      }

      promptUser(); // Continue the conversation
    });
  };

  promptUser();
};

run();

