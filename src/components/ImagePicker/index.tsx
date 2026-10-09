import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ChangeEvent } from "react";

interface ImagePickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
  label?: string;
}

const ImagePicker = ({
  file,
  onChange,
  label = "Selecionar imagem",
}: ImagePickerProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.files?.[0] ?? null);
  };

  return (
    <Stack spacing={1} sx={{ alignItems: "center" }}>
      <Button component="label" variant="outlined" startIcon={<PhotoCamera />}>
        {label}
        <input hidden accept="image/png,image/jpeg,image/webp,image/gif" type="file" onChange={handleChange} />
      </Button>
      {file && (
        <Typography variant="caption" color="text.secondary">
          {file.name}
        </Typography>
      )}
    </Stack>
  );
};

export default ImagePicker;
