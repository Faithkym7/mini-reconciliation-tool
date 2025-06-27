import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Divider,
  Stack,
  Box
} from '@mui/material';
import UploadSection from './components/UploadSection';
import ReconciliationSummary from './components/ReconciliationSummary';
import { compareTransactions } from './utils/reconciliation';
import type { Transaction, ReconciliationResult } from './types';

function App() {
  const [internalData, setInternalData] = useState<Transaction[]>([]);
  const [providerData, setProviderData] = useState<Transaction[]>([]);
  const [reconciliationResult, setReconciliationResult] = useState<ReconciliationResult | null>(null);

  const handleReconciliation = () => {
    if (internalData.length && providerData.length) {
      const result = compareTransactions(internalData, providerData);
      setReconciliationResult(result);
    } else {
      alert("Please upload both internal and provider data.");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        px: 2,
      }}
    >
      <Container maxWidth="xl">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={4}>
            <Typography variant="h4" align="center" fontWeight={600}>
              💳 Transaction Reconciliation Tool
            </Typography>

            <Divider />

            <UploadSection
              setInternalData={setInternalData}
              setProviderData={setProviderData}
              onReconcile={handleReconciliation}
            />

            {reconciliationResult && (
              <Box>
                <Divider sx={{ mb: 3 }} />
                <ReconciliationSummary result={reconciliationResult} />
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
