import type { Transaction, ReconciliationResult } from '../types';

export const compareTransactions = (
  internalData: Transaction[],
  providerData: Transaction[]
): ReconciliationResult => {
  const matched: Transaction[] = [];
  const internalOnly: Transaction[] = [];
  const providerOnly: Transaction[] = [];
  const amountMismatches: { transaction_reference: string; internalAmount: number; providerAmount: number; }[] = [];

  // Create a map of provider transactions for efficient lookup
  const providerMap = new Map<string, Transaction>();
  providerData.forEach(transaction => providerMap.set(transaction.reference, transaction));

  // Iterate through internal transactions
  internalData.forEach(internalTransaction => {
    const providerTransaction = providerMap.get(internalTransaction.reference);

    if (providerTransaction) {
      // Match found
      if (internalTransaction.amount === providerTransaction.amount) {
        matched.push(internalTransaction);
      } else {
        // Amount mismatch
        amountMismatches.push({
          transaction_reference: internalTransaction.reference,
          internalAmount: internalTransaction.amount,
          providerAmount: providerTransaction.amount,
        });
        matched.push(internalTransaction); // Consider it a match for reporting purposes
      }
      providerMap.delete(internalTransaction.reference); // Remove from provider map to avoid duplicates
    } else {
      // Internal only
      internalOnly.push(internalTransaction);
    }
  });

  // Remaining transactions in providerMap are provider only
  providerMap.forEach(transaction => providerOnly.push(transaction));

  return {
    matched,
    internalOnly,
    providerOnly,
    amountMismatches,
  };
};
