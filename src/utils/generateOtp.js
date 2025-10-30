const otpStore = new Set();

export const generateOTP = () => {
  let otp;

  do {
    otp = Math.floor(100000 + Math.random() * 900000).toString();
  } while (otpStore.has(otp));

  otpStore.add(otp);

  setTimeout(() => otpStore.delete(otp), 2 * 60 * 1000);

  return otp;
};
