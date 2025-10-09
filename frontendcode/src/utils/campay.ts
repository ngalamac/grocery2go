declare global {
  interface Window {
    campay: {
      options: (config: CampayConfig) => void;
      onSuccess?: (data: CampayResponse) => void;
      onFail?: (data: CampayResponse) => void;
      onModalClose?: (data: { status: string }) => void;
    };
  }
}

export interface CampayConfig {
  payButtonId: string;
  description: string;
  amount: string;
  currency: string;
  externalReference?: string;
  redirectUrl?: string;
}

export interface CampayResponse {
  status: string;
  reference: string;
}

export class CampayPayment {
  private config: CampayConfig;

  constructor(config: Omit<CampayConfig, 'payButtonId'>) {
    this.config = {
      payButtonId: 'campay-pay-button',
      ...config
    };
  }

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window.campay === 'undefined') {
        reject(new Error('Campay SDK not loaded'));
        return;
      }

      try {
        window.campay.options(this.config);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  onSuccess(callback: (data: CampayResponse) => void): void {
    if (window.campay) {
      window.campay.onSuccess = callback;
    }
  }

  onFail(callback: (data: CampayResponse) => void): void {
    if (window.campay) {
      window.campay.onFail = callback;
    }
  }

  onModalClose(callback: (data: { status: string }) => void): void {
    if (window.campay) {
      window.campay.onModalClose = callback;
    }
  }

  static formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  static generateReference(): string {
    return `GRO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
