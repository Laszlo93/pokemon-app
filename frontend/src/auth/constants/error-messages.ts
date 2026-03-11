import { commonErrorMessages } from 'src/common/constants/error-messages';

export const errorMessages = {
  ...commonErrorMessages,
  validationError:
    'Validation error (e.g. invalid email format, password too short, missing field)',
};
