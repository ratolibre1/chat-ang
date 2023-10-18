import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Chatroom } from '../classes/chatroom.class';
import { Message } from '../classes/message.class';
import { ApiResponse } from '../classes/api-response.class';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  userEmail: string = '';
  SUCCESS: string = 'success';

  constructor(public apiService: ApiService) {}

  async login(email: string, password: string): Promise<void> {
    const params = {
      email: email,
      password: password,
    };

    const response: ApiResponse<object> = await this.apiService.insecurePost(
      'auth/token',
      params
    );

    if (response.code == this.SUCCESS) {
      this.apiService.token = response.data.toString();
      this.userEmail = email;
    } else {
      this.apiService.token = '';
      this.userEmail = '';
    }
  }

  async getChatrooms(): Promise<Chatroom[]> {
    const chatrooms = [];

    const response: ApiResponse<any> = await this.apiService.get('chatrooms');

    if (response.code == this.SUCCESS) {
      const res = response.data.chatrooms;
      for (var preChatroom of res) {
        const chatroom = new Chatroom(
          preChatroom.name,
          preChatroom.desc,
          preChatroom.code
        );

        chatrooms.push(chatroom);
      }
    }

    return chatrooms;
  }

  async enterRoom(code: string): Promise<void> {
    const params = {
      email: this.userEmail,
      chatroom: code,
    };

    await this.apiService.patch('users/enter-chatroom', params);
  }

  async getMessages(code: string): Promise<Message[]> {
    if (code == '') {
      return [];
    }

    const messages = [];

    const response: ApiResponse<any> = await this.apiService.get(
      `messages/${code}`
    );

    if (response.code == this.SUCCESS) {
      const res = response.data.messages;
      for (var preMessage of res) {
        const message = new Message(
          preMessage.content,
          preMessage.sender,
          code,
          preMessage.timestamp
        );

        messages.push(message);
      }
    }

    return messages;
  }

  async sendMessage(message: Message): Promise<void> {
    const params = {
      content: message.content,
      sender: message.sender,
      chatroom: message.chatroom,
    };

    await this.apiService.post('messages', params);
  }
}
