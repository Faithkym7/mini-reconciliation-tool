import { useRef } from 'react';
import { Box,Typography, Stack, IconButton } from '@mui/material';
import { CloudUpload, Description, Close } from '@mui/icons-material';

interface DropUploadProps {
  label: string;
  disabled?: boolean;
  onChange: (file: File) => void;
  fileName?: string;
  onRemove?: () => void;
}

const DropUpload = ({ label, disabled, onChange, fileName, onRemove }: DropUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: disabled ? 'grey.400' : 'primary.main',
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? 'grey.100' : 'transparent',
        transition: '0.2s',
        '&:hover': {
          backgroundColor: disabled ? 'grey.100' : 'grey.50',
        },
      }}
      onClick={disabled ? undefined : handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".csv"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {!fileName ? (
        <Stack alignItems="center" spacing={1}>
          <CloudUpload color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="body1">{label}</Typography>
        </Stack>
      ) : (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Description color="action" />
            <Typography>{fileName}</Typography>
          </Stack>
          {onRemove && (
            <IconButton onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}>
              <Close />
            </IconButton>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default DropUpload;
