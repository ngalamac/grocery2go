import axios from 'axios';

export type MonetbilOperator =
  | 'CM_MTNMOBILEMONEY'
  | 'CM_ORANGEMONEY'
  | 'CM_EUMM';

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

const BASE_URL = process.env.MONETBIL_BASE_URL?.replace(/\/$/, '') || 'https://api.monetbil.com/payment/v1';
const SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY || '';
const NOTIFY_URL = process.env.MONETBIL_NOTIFY_URL;
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

  if (orange2 || orange3) return 'CM_ORANGEMONEY';
  if (mtn2 || mtn3) return 'CM_MTNMOBILEMONEY';

  // Default to MTN if uncertain; caller can override
  return 'CM_MTNMOBILEMONEY';
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
  const msisdn = normalizeCameroonMsisdn(params.phonenumber);
  const operator = params.operator || detectCameroonOperator(msisdn);

  if (MONETBIL_MOCK) {
    const paymentId = `mock_${Date.now()}`;
    return {
      status: 'REQUEST_ACCEPTED',
      message: 'Mocked payment initiated',
      channel: operator,
      channel_name: operator === 'CM_MTNMOBILEMONEY' ? 'MTN Mobile Money' : operator === 'CM_ORANGEMONEY' ? 'Orange Money' : 'EU Mobile Money',
      channel_ussd: operator === 'CM_MTNMOBILEMONEY' ? '*126*1#' : '*150#',
      paymentId,
      payment_url: `https://mock.monetbil.com/pay/${paymentId}`,
    };
  }

  const payload: PlacePaymentRequest = {
    service: SERVICE_KEY,
    phonenumber: msisdn,
    amount: Math.round(params.amount),
    operator,
    currency: params.currency || 'XAF',
    country: params.country || 'CM',
    item_ref: params.item_ref,
    payment_ref: params.payment_ref,
    user: params.user,
    first_name: params.first_name,
    last_name: params.last_name,
    email: params.email,
    notify_url: NOTIFY_URL,
  };

  const url = `${BASE_URL}/placePayment`;
  const { data } = await axios.post<PlacePaymentResponse>(url, payload, {
    timeout: 30_000,
    headers: { 'Content-Type': 'application/json' },
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

  const url = `${BASE_URL}/checkPayment`;
  const params = new URLSearchParams({ paymentId });
  const { data } = await axios.post<CheckPaymentResponse>(url, params.toString(), {
    timeout: 30_000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
}
