import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectLine, Message, ConnectionStatus } from 'botframework-directlinejs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder
  ) { }

  messages = new Array<Message>();
  messageForm: FormGroup;
  isChatbotTyping = false;
  readonly CHATBOT_ID = '';

  private directLine: DirectLine;
  private readonly INITIALIZATION_MESSAGE = 'CHATBOT_INITIALIZE';
  private readonly DIRECT_LINE_SECRET = 'Kr-tlVZKgEc.Op0nKTHDVoEvl4KQZcyFh970fSuVhjQacVMk6nDEOrw';

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      message: [null, Validators.required]
    });
    this.initializeConnection();
    this.subscribeToActivities();
    this.subscribeToConnectionStatus();
  }

  sendMessage(): void {
    this.directLine.postActivity({
      from: { id: '1', name: 'Urmot' },
      type: 'message',
      text: this.messageForm.value.message
    }).subscribe();
    this.messageForm.patchValue({ message: null });
  }

  private initializeConnection(): void {
    this.directLine = new DirectLine({
      secret: this.DIRECT_LINE_SECRET,
      conversationStartProperties: {
        locale: 'en-US'
      }
    });
  }

  private subscribeToActivities(): void {
    this.directLine.activity$.subscribe({
      next: (activity: any) => {
        if (activity.text && activity.text !== this.INITIALIZATION_MESSAGE) {
          this.messages.push(activity);
        }
      }
    });
  }

  private subscribeToConnectionStatus(): void {
    this.directLine.connectionStatus$.subscribe({
      next: connectionStatus => {
        if (connectionStatus === ConnectionStatus.Online) {
          this.directLine.postActivity({
            from: { id: '1', name: 'Urmot' },
            type: 'message',
            text: this.INITIALIZATION_MESSAGE
          }).subscribe();
        }
      }
    });
  }

}
