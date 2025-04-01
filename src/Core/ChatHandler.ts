require('dotenv').config();

import { OpenAI } from "openai";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";

interface Chat {
  sendMessage(input: string): Promise<string>;
}

export class ChatHandler implements Chat {
  private client: OpenAI;
  private pipeline: (user_input: { input: string }) => Promise<string>;
  private history: { role: "system" | "user" | "assistant"; content: string }[] = [];

  constructor() {
    this.client = wrapOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));
  
    this.pipeline = traceable(async (user_input: { input: string }) => {
      const result = await this.client.chat.completions.create({
        messages: [...this.history, { role: "user", content: user_input.input }],
        model: "gpt-3.5-turbo",
      });
      return result.choices[0].message?.content || "No response";
    });
  }

  setHistoryArray (history: { role: "system" | "user" | "assistant"; content: string }[]) {
    this.history = history;
  }

  async sendMessage(input: string): Promise<string> {
    try {
      const response = await this.pipeline({ input });
      this.history.push({ role: "user", content: input });
      this.history.push({ role: "assistant", content: response });

      return response;
    } catch (error) {
      console.error("Error in ChatHandler:", error);
      throw new Error("Failed to process the message.");
    }
  }

    getHistory() {
        return this.history;
    }
}
