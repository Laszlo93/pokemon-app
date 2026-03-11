import { ValidatorOptions } from 'class-validator';

export const classValidatorConfig: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
};
