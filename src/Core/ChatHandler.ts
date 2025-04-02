require('dotenv').config();

import { OpenAI } from "openai";
import { Client } from "langsmith";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";
import { ChatMessage } from "../Models/ChatModel";
import { Chat } from "./Interfaces/IChatHandler";

export class ChatHandler implements Chat {
  private client: OpenAI;
  private langsmithClient: Client;
  private pipeline: (user_input: { input: string }) => Promise<string>;
  private history: ChatMessage[] = [];
  private threadId: string | null = null;

  constructor(key: string) {
    this.threadId = key;
    this.client = wrapOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }), {
      project_name: process.env.LANGSMITH_PROJECT,
      metadata: { session_id: key },
    });
    this.langsmithClient = new Client();
  
    this.pipeline = traceable(async (user_input: { input: string }) => {
      const result = await this.client.chat.completions.create({
        messages: [...this.history, { role: "user", content: user_input.input }],
        model: "gpt-3.5-turbo",
      });
      return result.choices[0].message?.content || "No response";
    });
  }

  async getThreadHistory() {
    const filterString = `and(in(metadata_key, ["session_id","conversation_id","thread_id"]), eq(metadata_value, "${this.threadId}"))`;
    const runs = this.langsmithClient.listRuns({
      projectName: process.env.LANGSMITH_PROJECT,
      filter: filterString,
      runType: "llm",
    });

    const runsArray: { start_time: string; inputs: any; outputs: any }[] = [];
    for await (const run of runs) {
      runsArray.push({
        start_time: run.start_time?.toString() || "",
        inputs: run.inputs,
        outputs: run.outputs,
      });
    }
    const sortedRuns = runsArray.sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

    return sortedRuns;
  }


  setHistoryArray (history: ChatMessage[]) {
    this.history = history;
  }

  async sendMessage(input: string): Promise<string> {

    const responseThread = await this.getThreadHistory();
    console.log("Response Thread:", responseThread);

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
