import speakeasy from "speakeasy";
function randomNumber() {
  // let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  const secret = speakeasy.generateSecret();

  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32", // Encoding type
    step: 30, // Time step in seconds (default is 30 seconds)
    digits: 6, // Number of digits in the code
  });
  return otp;
}

export default randomNumber;
