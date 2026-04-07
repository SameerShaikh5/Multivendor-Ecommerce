import axios from "axios";

const authConfig = {
  auth: {
    username: process.env.RAZORPAY_KEY_ID,
    password: process.env.RAZORPAY_KEY_SECRET,
  },
};

export const createRazorpayContact = async (vendor) => {
  const res = await axios.post(
    "https://api.razorpay.com/v1/contacts",
    {
      name: vendor.businessName,
      email: vendor.email,
      contact: vendor.contact,
      type: "vendor",
    },
    authConfig
  );

  return res.data;
};

export const createFundAccount = async (contactId, vendor) => {
  const res = await axios.post(
    "https://api.razorpay.com/v1/fund_accounts",
    {
      contact_id: contactId,
      account_type: "bank_account",
      bank_account: {
        name: vendor.businessName,
        ifsc: vendor.ifscCode,
        account_number: vendor.bankAccountNumber,
      },
    },
    authConfig
  );

  return res.data;
};


export const createRazorpayPayout = async ({
  fundAccountId,
  amount,
  method
}) => {

  const res = await axios.post(
    "https://api.razorpay.com/v1/payouts",
    {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      fund_account_id: fundAccountId,
      amount,
      currency: "INR",
      mode: method,
      purpose: "payout"
    },
    authConfig
  );
  return res.data;
};