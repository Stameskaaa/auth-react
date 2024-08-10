interface ValidateResponse {
  errStatus: boolean;
  errMessage?: string;
}
export const emailValidate = (mail: string): ValidateResponse => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (mail.length === 0) {
    return { errStatus: true, errMessage: 'Email cannot be empty' };
  } else if (!emailRegex.test(mail)) {
    return { errStatus: true, errMessage: 'Invalid email' };
  } else {
    return { errStatus: false };
  }
};

export const passwordValidate = (pass: string): ValidateResponse => {
  return pass.length >= 8
    ? { errStatus: false }
    : pass.length === 0
    ? { errStatus: true, errMessage: ' ' }
    : { errStatus: true, errMessage: 'Password too short' };
};
