import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { type ChangeEvent, useState } from "react";

type MaskValue = string | number | null;
type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type MaskedTextFieldProps = Omit<
  TextFieldProps,
  "defaultValue" | "onChange" | "type" | "value"
> & {
  mask: string;
  value?: MaskValue;
  defaultValue?: MaskValue;
  onChange?: (event: TextInputEvent) => void;
};

type PublicMaskProps = Omit<MaskedTextFieldProps, "mask">;

function formatMaskedValue(value: MaskValue | undefined, mask: string): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  let digitIndex = 0;
  let formatted = "";

  for (const character of mask) {
    if (character === "9") {
      if (digitIndex >= digits.length) break;
      formatted += digits[digitIndex];
      digitIndex += 1;
      continue;
    }

    if (digits.length > 0 && digitIndex < digits.length) {
      formatted += character;
    }
  }

  return formatted;
}

const MaskedTextField = ({
  mask,
  value,
  defaultValue = "",
  onChange,
  ...props
}: MaskedTextFieldProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => (
    formatMaskedValue(defaultValue, mask)
  ));
  const maskedValue = isControlled
    ? formatMaskedValue(value, mask)
    : internalValue;

  const handleChange = (event: TextInputEvent): void => {
    const nextValue = formatMaskedValue(event.target.value, mask);

    if (!isControlled) setInternalValue(nextValue);

    if (onChange) {
      event.target.value = nextValue;
      onChange(event);
    }
  };

  return (
    <TextField
      {...props}
      type="tel"
      value={maskedValue}
      onChange={handleChange}
      fullWidth
    />
  );
};

export const InputCep = (props: PublicMaskProps) => (
  <MaskedTextField {...props} mask="99999-999" label="CEP" autoComplete="postal-code" />
);

export const InputCpf = (props: PublicMaskProps) => (
  <MaskedTextField {...props} mask="999.999.999-99" label="CPF" autoComplete="off" />
);

export const InputCnpj = (props: PublicMaskProps) => (
  <MaskedTextField {...props} mask="99.999.999/9999-99" label="CNPJ" autoComplete="off" />
);

export const InputPhone = ({ label = "Celular", ...props }: PublicMaskProps) => (
  <MaskedTextField {...props} mask="(99) 9 9999-9999" label={label} autoComplete="tel" />
);

export const InputPrice = (props: PublicMaskProps) => (
  <MaskedTextField {...props} mask="999 999.99" label="Preço" inputMode="decimal" autoComplete="off" />
);

export const InputHour = (props: PublicMaskProps) => (
  <MaskedTextField {...props} mask="99:99" label="Horas" autoComplete="off" />
);
