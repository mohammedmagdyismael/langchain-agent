export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
}
