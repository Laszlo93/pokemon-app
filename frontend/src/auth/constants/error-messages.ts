import { commonErrorMessages } from 'src/common/constants/error-messages';

export const errorMessages = {
  ...commonErrorMessages,
  badRequest: {
    validationErrorRegister:
      'Validation error (e.g. invalid email format, password too short, missing field)',
    validationErrorLogin:
      'Validation error (e.g. invalid email format, missing field)',
  },
  forbidden: {
    invalidLoginData: 'Invalid login data',
  },
};
