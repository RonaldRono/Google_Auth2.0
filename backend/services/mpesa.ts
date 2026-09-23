const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  TILL_NO,
  MPESA_TRANSACTIONTYPE,
  MPESA_CALLBACK_URL,
  MPESA_BASE_URL,
} = (globalThis as {
  process?: { env?: Record<string, string | undefined> };
}).process?.env ?? {};

// ── Helpers ────────────────────────────────────────────────────────────────

const getAccessToken = async (): Promise<string> => {
  const credentials = globalThis.btoa(
    `${MPESA_CONSUMER_KEY!}:${MPESA_CONSUMER_SECRET!}`
  );
  const response = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
    }
  );
  const data = (await response.json()) as { access_token?: string };
  if (!response.ok || !data.access_token) {
    throw new Error('Unable to obtain M-Pesa access token');
  }
  return data.access_token;
};

// ── STK Push ───────────────────────────────────────────────────────────────

interface StkPushParams {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  description: string;
}

interface StkPushResult {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}

export const initiateStkPush = async (params: StkPushParams): Promise<StkPushResult> => {
  try {
    const accessToken = await getAccessToken();

    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - tzOffset);
    const timestamp = localDate.toISOString().replace(/[^0-9]/g, '').slice(0, 14);

    const password = globalThis.btoa(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    );

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: MPESA_TRANSACTIONTYPE || 'CustomerBuyGoodsOnline',
      Amount: params.amount,
      PartyA: params.phoneNumber,
      PartyB: TILL_NO || MPESA_SHORTCODE,
      PhoneNumber: params.phoneNumber,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: params.accountReference,
      TransactionDesc: params.description,
    };

    const response = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw Object.assign(new Error(data?.errorMessage || 'STK Push failed'), {
        response: { data },
      });
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('STK Push failed:', err?.response?.data || err.message);
    return {
      success: false,
      error: err?.response?.data?.errorMessage || err.message || 'STK Push failed',
    };
  }
};

// ── Callback response builder ──────────────────────────────────────────────

export const buildMpesaCallbackResponse = (
  resultCode: number,
  resultDesc: string
): Record<string, any> => ({
  ResultCode: resultCode,
  ResultDesc: resultDesc,
});
