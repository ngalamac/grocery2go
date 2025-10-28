declare global {
  interface Window {
    chatbase: ChatbaseFunction & {
      q?: any[];
    };
  }
}

type ChatbaseFunction = {
  (command: 'open'): void;
  (command: 'close'): void;
  (command: 'getState'): 'initialized' | 'not-initialized';
  (command: 'toggle'): void;
  (command: 'show'): void;
  (command: 'hide'): void;
  (...args: any[]): void;
};

export class ChatbaseAssistant {
  private static checkAvailability(): boolean {
    return typeof window !== 'undefined' && typeof window.chatbase === 'function';
  }

  static open(): void {
    if (this.checkAvailability()) {
      window.chatbase('open');
    }
  }

  static close(): void {
    if (this.checkAvailability()) {
      window.chatbase('close');
    }
  }

  static toggle(): void {
    if (this.checkAvailability()) {
      window.chatbase('toggle');
    }
  }

  static show(): void {
    if (this.checkAvailability()) {
      window.chatbase('show');
    }
  }

  static hide(): void {
    if (this.checkAvailability()) {
      window.chatbase('hide');
    }
  }

  static getState(): 'initialized' | 'not-initialized' | 'unavailable' {
    if (this.checkAvailability()) {
      return window.chatbase('getState');
    }
    return 'unavailable';
  }

  static isInitialized(): boolean {
    return this.getState() === 'initialized';
  }
}
