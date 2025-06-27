import { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Download
} from '@mui/icons-material';
import type { ReconciliationResult, Transaction } from '../types';
import { exportToCSV } from '../utils/export';

interface ReconciliationSummaryProps {
  result: ReconciliationResult;
}

const TransactionTable = ({
  transactions,
  showAmountMismatch = false
}: {
  transactions: Transaction[];
  showAmountMismatch?: boolean;
}) => (
  <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 1 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
          {showAmountMismatch && (
            <TableCell sx={{ fontWeight: 'bold' }}>Provider Amount</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.reference}>
            <TableCell>{t.reference}</TableCell>
            <TableCell>{t.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const ReconciliationSummary = ({ result }: ReconciliationSummaryProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleExport = (data: any[], filename: string) => {
    exportToCSV(data, filename);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
        <Tab
          icon={<CheckCircle color="success" />}
          label={`Matched (${result.matched.length})`}
        />
        <Tab
          icon={<Warning color="warning" />}
          label={`Internal Only (${result.internalOnly.length})`}
        />
        <Tab
          icon={<Error color="error" />}
          label={`Provider Only (${result.providerOnly.length})`}
        />
      </Tabs>

      <Box sx={{ mt: 4 }}>
        {tabIndex === 0 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => handleExport(result.matched, 'matched-transactions')}
              sx={{ mb: 2 }}
            >
              Export Matched
            </Button>
            <TransactionTable
              transactions={result.matched}
              showAmountMismatch={true}
            />
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => handleExport(result.internalOnly, 'internal-only')}
              sx={{ mb: 2 }}
            >
              Export Internal Only
            </Button>
            <TransactionTable transactions={result.internalOnly} />
          </Box>
        )}
        {tabIndex === 2 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => handleExport(result.providerOnly, 'provider-only')}
              sx={{ mb: 2 }}
            >
              Export Provider Only
            </Button>
            <TransactionTable transactions={result.providerOnly} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReconciliationSummary;
