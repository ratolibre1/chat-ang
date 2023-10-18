import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { Chatroom } from 'src/app/classes/chatroom.class';
import { Message } from 'src/app/classes/message.class';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnDestroy {
  @ViewChild('messageContainer', { read: ElementRef })
  messageContainer: ElementRef;

  loginForm: FormGroup;
  userEmail: string = '';
  currentChatroom: string = '';
  showChatrooms: boolean = false;
  showChat: boolean = false;
  newMessage: string = '';

  timerSubscription: Subscription;

  chatrooms: Chatroom[];
  messages: Message[];

  constructor(
    private formBuilder: FormBuilder,
    public chatService: ChatService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.chatrooms = [];
    this.messages = [];

    this.messageContainer = new ElementRef(null);

    this.timerSubscription = interval(1000).subscribe(async () => {
      if (!this.showChat) {
        return;
      }

      let lastMessage: Message = new Message('', '', '', new Date());
      let newLastMessage: Message = new Message('', '', '', new Date());

      if (this.messages.length > 0) {
        lastMessage = this.messages[this.messages.length - 1];
      }
      this.messages = await this.chatService.getMessages(this.currentChatroom);
      if (this.messages.length > 0) {
        newLastMessage = this.messages[this.messages.length - 1];
      }

      if (lastMessage.timestamp != newLastMessage.timestamp) {
        this.scrollToBottom();
      }
    });
  }

  onContentLoaded(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm && this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      if (email && password) {
        await this.chatService.login(email, password);
        this.chatrooms = await this.chatService.getChatrooms();
        this.userEmail = email;
        this.showChatrooms = true;
      }
    }
  }

  async enterChatRoom(code: string): Promise<void> {
    await this.chatService.enterRoom(code);
    this.currentChatroom = code;
    this.messages = await this.chatService.getMessages(code);
    this.showChat = true;
    this.scrollToBottom();
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage) {
      const message = new Message(
        this.newMessage,
        this.userEmail,
        this.currentChatroom,
        new Date()
      );

      await this.chatService.sendMessage(message);
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
