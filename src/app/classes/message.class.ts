export class Message {
  content: string;
  sender: string;
  chatroom: string;
  timestamp: Date;

  constructor(
    content: string,
    sender: string,
    chatroom: string,
    timestamp: Date
  ) {
    this.content = content;
    this.sender = sender;
    this.chatroom = chatroom;
    this.timestamp = timestamp;
  }
}
