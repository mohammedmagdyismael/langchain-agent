import { ChatMessage } from "../../Models/ChatModel";

export interface Chat {
  sendMessage(input: string): Promise<string>;
  getHistory(): ChatMessage[];
  setHistoryArray(history: ChatMessage[]): void;
}
