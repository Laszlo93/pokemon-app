import { Controller, type Control, type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';

type RhfTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  rules?: RegisterOptions<T, FieldPath<T>>;
} & Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref'>;

export function RhfTextField<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...textFieldProps
}: RhfTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...textFieldProps}
          {...field}
          label={label}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          fullWidth
          size="small"
        />
      )}
    />
  );
}
