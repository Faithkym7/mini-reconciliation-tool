import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import {
  Button, Alert, Box, Select, MenuItem,
  FormControl, InputLabel, Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { CheckCircle } from '@mui/icons-material';
import Papa from 'papaparse';
import type { Transaction } from '../types';
import DropUpload from './DropUpload'; // adjust path if needed

interface UploadSectionProps {
  setInternalData: (data: Transaction[]) => void;
  setProviderData: (data: Transaction[]) => void;
  onReconcile: () => void;
}

const UploadSection = ({
  setInternalData,
  setProviderData,
  onReconcile,
}: UploadSectionProps) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [internalHeaders, setInternalHeaders] = useState<string[]>([]);
  const [providerHeaders, setProviderHeaders] = useState<string[]>([]);

  const [internalReferenceColumn, setInternalReferenceColumn] = useState('');
  const [internalAmountColumn, setInternalAmountColumn] = useState('');
  const [providerReferenceColumn, setProviderReferenceColumn] = useState('');
  const [providerAmountColumn, setProviderAmountColumn] = useState('');

  const [internalProcessed, setInternalProcessed] = useState(false);
  const [providerProcessed, setProviderProcessed] = useState(false);

  const internalFileRef = useRef<HTMLInputElement>(null);
  const providerFileRef = useRef<HTMLInputElement>(null);

  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [providerFile, setProviderFile] = useState<File | null>(null);
  const [internalFileName, setInternalFileName] = useState<string>('');
  const [providerFileName, setProviderFileName] = useState<string>('');

  const handleFileUpload = (isInternal: boolean) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setError(null);
      setSuccessMessage('');

      if (file) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length) {
              setError('Error parsing CSV file');
              return;
            }

            const parsedHeaders = Object.keys(results.data[0] || {});
            if (isInternal) {
              setInternalHeaders(parsedHeaders);
            } else {
              setProviderHeaders(parsedHeaders);
            }
          },
          error: (error) => {
            setError(`Error: ${error.message}`);
          },
        });
      }
    };

  const processData = (file: File | null, referenceColumn: string, amountColumn: string, setter: (data: Transaction[]) => void, fileType: 'internal' | 'provider' | null) => {
    if (!setter || !referenceColumn || !amountColumn || !file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const mappedData: Transaction[] = (results.data as Record<string, string>[])
          .map(row => ({
            reference: String(row[referenceColumn] || ''),
            amount: parseFloat(row[amountColumn] || '0') || 0,
            date: row.Date || '',
            status: row.Status || 'pending',
          }))
          .filter(t => t.reference && !isNaN(t.amount));

        setter(mappedData);

        const fileTypeStr = fileType === 'internal' ? 'Internal' : 'Provider';
        setSuccessMessage(`${fileTypeStr} file processed successfully: ${mappedData.length} records.`);
        if (setter === setInternalData) setInternalProcessed(true);
        if (setter === setProviderData) setProviderProcessed(true);

        // Cleanup - do not cleanup headers here
        if (setter === setInternalData) {
          setInternalReferenceColumn('');
          setInternalAmountColumn('');
        } else {
          setProviderReferenceColumn('');
          setProviderAmountColumn('');
        }

        setTimeout(() => setSuccessMessage(''), 3000);
      }
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {error && (
          <Grid xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {successMessage && (
          <Grid xs={12}>
            <Alert severity="success" icon={<CheckCircle />}>
              {successMessage}
            </Alert>
          </Grid>
        )}

        {/* STEP 1: Choose File */}
        {(!internalHeaders.length || !providerHeaders.length) && (
          <>
            <Grid xs={12} md={6}>
              <DropUpload
                label="Upload Internal CSV"
                disabled={internalProcessed}
                fileName={internalFileName}
                onChange={(file) => {
                  setInternalFile(file);
                  setInternalFileName(file.name);
                  handleFileUpload(true)({ target: { files: [file] } } as any);
                }}
                onRemove={() => {
                  setInternalFile(null);
                  setInternalFileName('');
                  setInternalHeaders([]);
                  setInternalProcessed(false);
                  setInternalReferenceColumn('');
                  setInternalAmountColumn('');
                  if (internalFileRef.current) internalFileRef.current.value = '';
                }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <DropUpload
                label="Upload Provider CSV"
                disabled={providerProcessed}
                fileName={providerFileName}
                onChange={(file) => {
                  setProviderFile(file);
                  setProviderFileName(file.name);
                  handleFileUpload(false)({ target: { files: [file] } } as any);
                }}
                onRemove={() => {
                  setProviderFile(null);
                  setProviderFileName('');
                  setProviderHeaders([]);
                  setProviderProcessed(false);
                  setProviderReferenceColumn('');
                  setProviderAmountColumn('');
                  if (providerFileRef.current) providerFileRef.current.value = '';
                }}
              />
            </Grid>
          </>
        )}

    <Grid container spacing={3}>
    {/* Internal Mapping */}
    {internalHeaders.length > 0 && (
        <Grid xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
            Map Internal Columns
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Reference Column</InputLabel>
            <Select
            value={internalReferenceColumn}
            onChange={(e) => setInternalReferenceColumn(e.target.value)}
            label="Reference Column"
            >
            {internalHeaders.map(h => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
            </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Amount Column</InputLabel>
            <Select
            value={internalAmountColumn}
            onChange={(e) => setInternalAmountColumn(e.target.value)}
            label="Amount Column"
            >
            {internalHeaders.map(h => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
            </Select>
        </FormControl>

        <Button
            variant="contained"
            color="primary"
            onClick={() => processData(internalFile, internalReferenceColumn, internalAmountColumn, setInternalData, 'internal')}
            disabled={!internalReferenceColumn || !internalAmountColumn}
            fullWidth
        >
            Process Internal File
        </Button>
        </Grid>
    )}

    {/* Provider Mapping */}
    {providerHeaders.length > 0 && (
        <Grid xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
            Map Provider Columns
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Reference Column</InputLabel>
            <Select
            value={providerReferenceColumn}
            onChange={(e) => setProviderReferenceColumn(e.target.value)}
            label="Reference Column"
            >
            {providerHeaders.map(h => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
            </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Amount Column</InputLabel>
            <Select
            value={providerAmountColumn}
            onChange={(e) => setProviderAmountColumn(e.target.value)}
            label="Amount Column"
            >
            {providerHeaders.map(h => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
            </Select>
        </FormControl>

        <Button
            variant="contained"
            color="primary"
            onClick={() => processData(providerFile, providerReferenceColumn, providerAmountColumn, setProviderData, 'provider')}
            disabled={!providerReferenceColumn || !providerAmountColumn}
            fullWidth
        >
            Process Provider File
        </Button>
        </Grid>
    )}
    </Grid>


        {/* STEP 3: Reconcile */}
        {internalProcessed && providerProcessed && (
          <Grid xs={12}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={onReconcile}
              disabled={!internalProcessed || !providerProcessed}
            >
              Reconcile Transactions
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UploadSection;
