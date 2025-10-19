import axios from 'axios';
import qs from 'qs';

export type MonetbilOperator = 'CM_MTN' | 'CM_ORANGE' | 'CM_EUMM';

export interface PlacePaymentRequest {
  service: string;
  phonenumber: string;
  amount: number;
  operator: MonetbilOperator;
  currency: 'XAF';
  country: 'CM';
  item_ref?: string;
  payment_ref?: string;
  user?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  notify_url?: string;
}

export interface PlacePaymentResponse {
  status: string; // e.g. REQUEST_ACCEPTED
  message: string;
  channel?: string; // CM_MTNMOBILEMONEY
  channel_name?: string; // MTN Mobile Money
  channel_ussd?: string; // *126*1#
  paymentId?: string;
  payment_url?: string;
}

export interface CheckPaymentResponse {
  paymentId: string;
  message: string; // payment pending | payment finish
  transaction?: {
    transaction_UUID?: string;
    created_date?: string;
    start_time?: string;
    end_time?: string;
    msisdn?: string;
    mobile_operator_name_short?: string;
    mobile_operator_name?: string;
    mobile_network_code?: string;
    mobile_operator_code?: string;
    mobile_country_code?: string;
    country_name?: string;
    country_code?: string;
    country_iso?: string;
    user?: string;
    amount?: number;
    fee?: number;
    revenue?: number;
    currency?: string;
    status?: 1 | 0 | -1 | -2; // 1 success, 0 failed, -1 cancelled, -2 refunded
    message?: string;
    http_user_agent?: string;
    device?: string;
    device_constructor?: string;
    device_model?: string;
    os?: string;
    os_version?: string;
    browser?: string;
    browser_version?: string;
    ip_address?: string;
    isp?: string;
    isp_org?: string;
    region_code?: string;
    region_name?: string;
    localisation_string?: string;
    query_string?: string;
    notify?: string;
    item_ref?: string;
    payment_ref?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    receipt_sent?: string;
    api_call?: string;
  };
}

const trimSlash = (s?: string) => (s ? s.replace(/\/$/, '') : s);
const BASE_URL = trimSlash(process.env.MONETBIL_BASE_URL) || 'https://api.monetbil.com/payment/v1';
const WIDGET_BASE_URL = trimSlash(process.env.MONETBIL_WIDGET_BASE_URL) || 'https://api.monetbil.com/widget/v2.1';
const SERVICE_KEY = process.env.MONETBIL_KEY || process.env.MONETBIL_SERVICE_KEY || '';
const NOTIFY_URL = process.env.MONETBIL_NOTIFY_URL;
const DEFAULT_LOCALE = process.env.MONETBIL_LOCALE || 'fr';
const MONETBIL_MOCK = process.env.MONETBIL_MOCK === 'true' || !SERVICE_KEY;

export function normalizeCameroonMsisdn(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('237') && digits.length === 12) return digits;
  if (digits.startsWith('6') && digits.length === 9) return `237${digits}`;
  if (digits.startsWith('06') && digits.length === 10) return `237${digits.substring(1)}`;
  if (digits.length === 8) return `2376${digits}`;
  return digits; // fallback
}

export function detectCameroonOperator(msisdn: string): MonetbilOperator {
  // Expect msisdn like 2376XXXXXXXX
  const local = msisdn.startsWith('237') ? msisdn.slice(3) : msisdn;
  const prefix2 = local.substring(0, 2);
  const prefix3 = local.substring(0, 3);

  // Orange prefixes (from docs): 69, 655-659, 685-689
  const orange2 = prefix2 === '69';
  const orange3 =
    (Number(prefix3) >= 655 && Number(prefix3) <= 659) ||
    (Number(prefix3) >= 685 && Number(prefix3) <= 689);

  // MTN prefixes (from docs): 67, 650-654, 680-684
  const mtn2 = prefix2 === '67';
  const mtn3 =
    (Number(prefix3) >= 650 && Number(prefix3) <= 654) ||
    (Number(prefix3) >= 680 && Number(prefix3) <= 684);

  if (orange2 || orange3) return 'CM_ORANGE';
  if (mtn2 || mtn3) return 'CM_MTN';

  // Default to MTN if uncertain; caller can override
  return 'CM_MTN';
}

export async function placePayment(params: {
  amount: number;
  phonenumber: string;
  operator?: MonetbilOperator;
  currency?: 'XAF';
  country?: 'CM';
  item_ref?: string;
  payment_ref?: string;
  user?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}): Promise<PlacePaymentResponse> {
  console.log('ENTERING placePayment service');
  // In mock mode, short-circuit immediately (even if SERVICE_KEY is unset)
  if (MONETBIL_MOCK) {
    const msisdn = normalizeCameroonMsisdn(params.phonenumber);
    const operator = params.operator || detectCameroonOperator(msisdn);
    const paymentId = `mock_${Date.now()}`;
    return {
      status: 'REQUEST_ACCEPTED',
      message: 'Mocked payment initiated',
      channel: operator,
      channel_name: operator === 'CM_MTN' ? 'MTN Mobile Money' : operator === 'CM_ORANGE' ? 'Orange Money' : 'EU Mobile Money',
      channel_ussd: operator === 'CM_MTN' ? '*126*1#' : '*150#',
      paymentId,
      payment_url: `https://mock.monetbil.com/pay/${paymentId}`,
    };
  }
  if (!SERVICE_KEY) {
    console.error('MONETBIL_SERVICE_KEY is not set.');
    throw new Error('Monetbil service key is not configured.');
  }
  const msisdn = normalizeCameroonMsisdn(params.phonenumber);
  const operator = params.operator || detectCameroonOperator(msisdn);

  const payload = {
    service: SERVICE_KEY,
    phonenumber: msisdn,
    amount: Math.round(params.amount),
    operator,
    currency: params.currency || 'XAF',
    country: params.country || 'CM',
    payment_ref: params.payment_ref,
    first_name: params.first_name,
    email: params.email,
    notify_url: NOTIFY_URL,
  };

  const url = `${BASE_URL}/placePayment`;
  const { data } = await axios.post<PlacePaymentResponse>(url, qs.stringify(payload), {
    timeout: 30_000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
}

export async function checkPayment(paymentId: string): Promise<CheckPaymentResponse> {
  if (MONETBIL_MOCK) {
    return {
      paymentId,
      message: 'payment finish',
      transaction: {
        transaction_UUID: `uuid_${paymentId}`,
        status: 1,
        message: 'Transaction successful (mock)',
        amount: 1000,
        fee: 0,
        revenue: 1000,
        currency: 'XAF',
        msisdn: '237600000000',
        mobile_operator_code: 'CM_MTNMOBILEMONEY',
      },
    };
  }

  try {
    const url = `${BASE_URL}/checkPayment`;
    const params = new URLSearchParams({ paymentId });
    const { data } = await axios.post<CheckPaymentResponse>(url, params.toString(), {
      timeout: 30_000,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  } catch (error: any) {
    const detail = error?.response?.data || error?.message;
    throw new Error(`Monetbil checkPayment failed: ${JSON.stringify(detail)}`);
  }
}

// Widget API v2.1
export async function createWidgetPayment(params: {
  amount: number;
  phone: string;
  payment_ref: string;
  return_url: string;
  cancel_url: string;
  notify_url?: string;
  item_ref?: string;
  user?: string; // email or user id
  country?: 'CM';
  currency?: 'XAF';
  locale?: string;
}): Promise<{ success: boolean; payment_url?: string }> {
  const msisdn = normalizeCameroonMsisdn(params.phone);
  if (MONETBIL_MOCK) {
    return {
      success: true,
      payment_url: `https://mock.monetbil.com/widget/pay/${Date.now()}`,
    };
  }
  if (!SERVICE_KEY) {
    throw new Error('Monetbil service key is not configured.');
  }
  const url = `${WIDGET_BASE_URL}/${SERVICE_KEY}`;
  const body = {
    amount: Math.round(params.amount),
    phone: msisdn,
    country: params.country || 'CM',
    currency: params.currency || 'XAF',
    locale: params.locale || DEFAULT_LOCALE,
    payment_ref: params.payment_ref,
    return_url: params.return_url,
    cancel_url: params.cancel_url,
    notify_url: params.notify_url || NOTIFY_URL,
    item_ref: params.item_ref,
    user: params.user,
  };
  try {
    const { data } = await axios.post(url, body, {
      timeout: 30_000,
      headers: { 'Content-Type': 'application/json' },
    });
    return data as { success: boolean; payment_url?: string };
  } catch (error: any) {
    const detail = error?.response?.data || error?.message;
    throw new Error(`Monetbil widget create failed: ${JSON.stringify(detail)}`);
  }
}
