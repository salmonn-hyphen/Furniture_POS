export const checkUser = (user: any) => {
  if (user) {
    const error: any = new Error(
      "This phone number has been already registered"
    );
    error.status = 409;
    error.code = "Already_Registered";
    throw error;
  }
};

export const checkErrorIfSameDate = (
  isSameDate: boolean,
  errorCount: number
) => {
  if (isSameDate && errorCount === 5) {
    const error: any = new Error("OTP is wrong for 5 times, Please Try ");
    error.status = 401;
    error.code = "Error_OverLimit";
    throw error;
  }
};

export const checkOtpInfo = (otpInfo: any) => {
  if (!otpInfo) {
    const error: any = new Error("Phone Number is incorrect");
    error.status = 400;
    error.code = "Error_Invalid";
    throw error;
  }
};

export const checkUserIfNotExist = (user: any) => {
  if (!user) {
    const error: any = new Error("This phone has not registered");
    error.status = 401;
    error.code = "Error_Unauthenticated";
    throw error;
  }
};
