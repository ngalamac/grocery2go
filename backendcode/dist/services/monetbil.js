"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCameroonMsisdn = normalizeCameroonMsisdn;
exports.detectCameroonOperator = detectCameroonOperator;
exports.placePayment = placePayment;
exports.checkPayment = checkPayment;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = process.env.MONETBIL_BASE_URL?.replace(/\/$/, '') || 'https://api.monetbil.com/payment/v1';
const SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY || '';
const NOTIFY_URL = process.env.MONETBIL_NOTIFY_URL;
const MONETBIL_MOCK = process.env.MONETBIL_MOCK === 'true' || !SERVICE_KEY;
function normalizeCameroonMsisdn(input) {
    const digits = input.replace(/\D/g, '');
    if (digits.startsWith('237') && digits.length === 12)
        return digits;
    if (digits.startsWith('6') && digits.length === 9)
        return `237${digits}`;
    if (digits.startsWith('06') && digits.length === 10)
        return `237${digits.substring(1)}`;
    if (digits.length === 8)
        return `2376${digits}`;
    return digits; // fallback
}
function detectCameroonOperator(msisdn) {
    // Expect msisdn like 2376XXXXXXXX
    const local = msisdn.startsWith('237') ? msisdn.slice(3) : msisdn;
    const prefix2 = local.substring(0, 2);
    const prefix3 = local.substring(0, 3);
    // Orange prefixes (from docs): 69, 655-659, 685-689
    const orange2 = prefix2 === '69';
    const orange3 = (Number(prefix3) >= 655 && Number(prefix3) <= 659) ||
        (Number(prefix3) >= 685 && Number(prefix3) <= 689);
    // MTN prefixes (from docs): 67, 650-654, 680-684
    const mtn2 = prefix2 === '67';
    const mtn3 = (Number(prefix3) >= 650 && Number(prefix3) <= 654) ||
        (Number(prefix3) >= 680 && Number(prefix3) <= 684);
    if (orange2 || orange3)
        return 'CM_ORANGEMONEY';
    if (mtn2 || mtn3)
        return 'CM_MTNMOBILEMONEY';
    // Default to MTN if uncertain; caller can override
    return 'CM_MTNMOBILEMONEY';
}
async function placePayment(params) {
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
    const payload = {
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
    const formParams = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
        if (value !== undefined && value !== null) {
            formParams.append(key, String(value));
        }
    }
    const { data } = await axios_1.default.post(url, formParams.toString(), {
        timeout: 30000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
}
async function checkPayment(paymentId) {
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
    const { data } = await axios_1.default.post(url, params.toString(), {
        timeout: 30000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
}
